# VPS Migration Guide — Overhaul Deployment

Migrating the live VPS from the legacy `live` branch + `docker-compose.vps.yml` setup to the
new `main`/`staging` overhaul running on `docker-compose.prod.yml`.

**The single most important change:** the materialized-view tree shrinks from ~350 views to 5,
and aggregated stats are now computed at query time. This guide treats your production **data**
(Strapi tables + uploaded images) as sacred and rebuilds everything else around it.

> Read the **"Why this is not a simple `git pull`"** section at the bottom first if you want the
> reasoning. The steps below are written so you can follow them top-to-bottom.

---

## 0. What is actually changing

| Thing | Old (current VPS) | New (overhaul) |
|---|---|---|
| Branch deployed | `live` | `main` (== `staging` at deploy time) |
| Compose file | `docker-compose.vps.yml` | `docker-compose.prod.yml` |
| Compose project name | *(directory name)* | `zadar-museum-prod` (hardcoded `name:`) |
| Volumes (real Docker names) | `<dir>_postgres_prod_data`, `<dir>_strapi_uploads` | `zadar-museum-prod_postgres_prod_data`, `zadar-museum-prod_strapi_uploads` |
| nginx config | `nginx/nginx.vps.conf` | `nginx/nginx.prod.conf` |
| Extra services | — | `redis` |
| Env file | `.env` | `.env.prod` |
| Materialized views | ~350 (Layer 1/2/3) | 5 (Layer 1 only) |
| Stats aggregation | pre-built MVs | query-time in backend |

**Three traps this guide defuses:**
1. The new compose creates **new, empty** volumes → without a dump/restore your DB and images
   appear wiped. We do an explicit backup → restore.
2. A restored dump brings back all ~350 old MVs, which can make Strapi's startup migrations fail.
   We **drop all MVs before starting the new backend**, then create the 5 new ones.
3. GHCR `:latest` is built from **`staging`**, not `main`. Merging to main triggers no build.
   We verify the image is current before deploying.

Container names are identical between old and new compose (`postgres_prod`, `strapi_prod`,
`react_prod`, `nginx_prod`), so `docker exec <name>` works on both stacks. We rely on that.

---

## 1. Pre-flight on your laptop (before touching the VPS)

### 1.1 Make sure staging is the real overhaul and CI built it
```bash
git checkout staging && git pull origin staging
git log --oneline -3
```
The GHCR images are built **only** when `staging` is pushed and only when `backend/**` or
`frontend/**` changed. Confirm the latest backend & frontend images exist and are recent:

- GitHub → repo → **Packages** → `zadar-museum-backend` / `zadar-museum-frontend`
- Confirm a `latest` tag updated **after** your last overhaul commit. If the last staging commit
  only touched `sql/` or root files, **no new image was built** — push a trivial change under
  `backend/` or re-run the workflow so `:latest` matches the overhaul.

### 1.2 Merge staging → main (source-of-truth release)
The deploy pulls **git** (`main`) for compose/sql/scripts and **GHCR** (`:latest`, from staging)
for images. They must agree, so make `main == staging`:
```bash
git checkout main && git pull origin main
git merge --ff-only staging        # or open the PR and merge it
git push origin main
```
After this, `main` and `staging` point at the same commit. Deploy from `main` on the VPS.

> If `--ff-only` fails, main has commits staging doesn't. Reconcile first; do **not** deploy a
> main that differs from the image-producing staging commit.

---

## 2. On the VPS — preparation and a full safety backup

SSH into the VPS and `cd` into the deploy directory (the repo checkout currently on `live`).

### 2.1 Record the current state (for rollback)
```bash
cd /path/to/zadar-museum          # your actual deploy dir
git rev-parse --abbrev-ref HEAD   # should print: live
docker compose -f docker-compose.vps.yml ps
docker volume ls | grep -E 'postgres_prod_data|strapi_uploads'
```
Write down the volume names exactly — those old volumes are your in-place rollback.

### 2.2 Confirm the old stack is healthy and count the MVs you're replacing
```bash
docker exec postgres_prod psql -U strapi -d strapi -c \
  "SELECT count(*) AS matview_count FROM pg_matviews WHERE schemaname NOT IN ('pg_catalog','information_schema');"
```
Expect a number around ~350. This is what collapses to 5.

### 2.3 Take the authoritative backup (DB + uploads) — by container name
This does **not** depend on any compose project, so it works against the running `live` stack:
```bash
STAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p ~/zadar-premigration

# Database (plain SQL dump — schema + data + the old MVs)
docker exec postgres_prod sh -c \
  "export PGCLIENTENCODING=UTF8; pg_dump -U strapi -d strapi" \
  > ~/zadar-premigration/db-$STAMP.sql

# Uploaded images
docker exec strapi_prod sh -c "tar czf - -C /app/public/uploads ." \
  > ~/zadar-premigration/uploads-$STAMP.tar.gz

ls -lh ~/zadar-premigration/
```

### 2.4 VERIFY the backup before going further (do not skip)
```bash
# DB dump is non-trivial and ends cleanly
tail -n 3 ~/zadar-premigration/db-$STAMP.sql        # should end with "PostgreSQL database dump complete"
grep -c 'CREATE TABLE' ~/zadar-premigration/db-$STAMP.sql   # should be > 0

# Uploads archive is valid gzip and not empty
gzip -t ~/zadar-premigration/uploads-$STAMP.tar.gz && echo "uploads archive OK"
tar tzf ~/zadar-premigration/uploads-$STAMP.tar.gz | head
```

### 2.5 Copy the backup OFF the VPS (disaster insurance)
From your laptop:
```bash
scp 'user@vps:~/zadar-premigration/*' ./vps-premigration-backup/
```
**Do not proceed until you have a verified copy off-box.**

---

## 3. Put the new configuration in place on the VPS

### 3.1 Build `.env.prod` from your current real secrets
The new compose reads `--env-file .env.prod`. Reuse the **existing** secrets so the restored
database password, JWT secrets and CORS all keep matching:
```bash
cp .env .env.prod      # start from the secrets currently in use
```
Then edit `.env.prod` and ensure all of these keys are present and correct (compare against
`.env.prod.example`). The new prod stack needs:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `DATABASE_HOST=postgres`, `DATABASE_PORT=5432`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
  - **`DATABASE_PASSWORD` must equal `POSTGRES_PASSWORD`** (it initializes the fresh volume).
- `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`
  - Keep the **same values** as the old `.env`, otherwise admin sessions/tokens break.
- `CORS_ORIGINS` (keep your real domains), `PROXY=true`
- `PUBLIC_URL=https://ovdjejekosarkasve.com` (production URL, not localhost)

> `REDIS_URL` is hardcoded in `docker-compose.prod.yml` (`redis://redis:6379`) — nothing to set.

### 3.2 Fetch the overhaul code
```bash
git fetch origin
git checkout main
git pull origin main
git log --oneline -1     # must match the commit you merged in step 1.2
```

### 3.3 Sanity-check the pieces the new stack expects
```bash
test -f docker-compose.prod.yml && echo compose OK
test -f nginx/nginx.prod.conf   && echo nginx OK
test -d certbot/conf/live/ovdjejekosarkasve.com && echo "TLS certs present" || echo "WARN: certs missing"
ls "sql/Layer 1"/   # expect 5 files: 4 *_boxscore/schedule + zz_layer1_indexes.sql
```
The TLS certs live in the host bind-mount `./certbot/conf` — they are **not** in a Docker volume,
so they survive this migration untouched. If the WARN fires, see step 7 / README.deploy.md SSL note.

---

## 4. Cut over: stop the old stack (keep its volumes)

```bash
# Stop & remove old containers, but KEEP volumes (no -v) so rollback is possible
docker compose -f docker-compose.vps.yml down

# Confirm old data volumes still exist
docker volume ls | grep -E 'postgres_prod_data|strapi_uploads'
```
At this point the site is down. The window is short (a few minutes). The old volumes remain as a
fallback.

---

## 5. Bring up the new stack and restore data

### 5.1 Pull the overhaul images
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
```

### 5.2 Start **only Postgres** (creates the fresh, empty prod volume)
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d postgres
# wait for healthy
docker compose -f docker-compose.prod.yml ps
```

### 5.3 Restore the database dump into the fresh DB
```bash
LATEST_DB=$(ls -1t ~/zadar-premigration/db-*.sql | head -1)
echo "Restoring $LATEST_DB"

docker cp "$LATEST_DB" postgres_prod:/tmp/restore.sql
docker exec postgres_prod psql -U strapi -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='strapi' AND pid<>pg_backend_pid();"
docker exec postgres_prod psql -U strapi -d postgres -c "DROP DATABASE IF EXISTS strapi;"
docker exec postgres_prod psql -U strapi -d postgres -c "CREATE DATABASE strapi WITH OWNER strapi ENCODING 'UTF8';"
docker exec -e PGCLIENTENCODING=UTF8 postgres_prod psql -U strapi -d strapi -f /tmp/restore.sql
docker exec postgres_prod rm -f /tmp/restore.sql
```

### 5.4 Drop ALL old materialized views BEFORE the backend starts
This is the critical MV step. It removes all ~350 restored MVs so Strapi's startup migrations
cannot be blocked by MV column dependencies. Base Strapi tables are untouched (MVs depend on
tables, never the reverse).
```bash
docker exec postgres_prod psql -U strapi -d strapi -v ON_ERROR_STOP=1 -c "
DO \$\$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, matviewname
    FROM pg_matviews
    WHERE schemaname NOT IN ('pg_catalog','information_schema')
  LOOP
    EXECUTE format('DROP MATERIALIZED VIEW IF EXISTS %I.%I CASCADE', r.schemaname, r.matviewname);
  END LOOP;
END \$\$;"

# Verify zero MVs remain
docker exec postgres_prod psql -U strapi -d strapi -c \
  "SELECT count(*) AS should_be_zero FROM pg_matviews WHERE schemaname NOT IN ('pg_catalog','information_schema');"
```

### 5.5 Start Redis + backend (Strapi runs its schema migrations on a clean, MV-free DB)
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d redis backend
docker compose -f docker-compose.prod.yml logs -f backend
```
Watch until Strapi reports it is listening on `:1337` with no migration errors. `Ctrl-C` to stop
tailing once healthy.

### 5.6 Create the 5 new Layer-1 materialized views

> **GATE:** If the prod data contains duplicate stat rows, the unique-index step of
> `zz_layer1_indexes.sql` will **abort** here (`could not create unique index ... is duplicated`).
> You must have already cleaned them — see **Appendix A. De-duplicating source data**. Confirm
> zero duplicates before running this step.

Run from the repo root on the VPS. `--force` ensures the new overhaul definitions are applied even
for views whose names also existed before (e.g. `player_boxscore`):
```bash
bash scripts/apply-mvs.sh --compose-file docker-compose.prod.yml --env-file .env.prod --force
```
> If `apply-mvs.sh` cannot find the stack, fall back to the temporary-node-container method in
> `README.deploy.md` §4, pointing `SQL_DIR` at `sql/Layer 1`. Either way it applies only the 5
> Layer-1 files + `zz_layer1_indexes.sql`.

Verify exactly 5 MVs and that they have rows:
```bash
docker exec postgres_prod psql -U strapi -d strapi -c \
  "SELECT matviewname FROM pg_matviews WHERE schemaname='public' ORDER BY 1;"
docker exec postgres_prod psql -U strapi -d strapi -c "SELECT count(*) FROM public.player_boxscore;"
docker exec postgres_prod psql -U strapi -d strapi -c "SELECT count(*) FROM public.team_boxscore;"
```
Expect `coach_boxscore`, `player_boxscore`, `schedule`, `team_boxscore` (+ index-only file adds no
view) — i.e. **4 matviews**, each with non-zero rows. (The "~5" includes the indexes file which
creates no view; if your Layer 1 defines a 5th view it will appear here.)

### 5.7 Restore uploaded images into the new uploads volume
```bash
LATEST_UP=$(ls -1t ~/zadar-premigration/uploads-*.tar.gz | head -1)
docker exec strapi_prod sh -c "rm -rf /app/public/uploads/* /app/public/uploads/.[!.]* 2>/dev/null || true"
docker cp "$LATEST_UP" strapi_prod:/tmp/uploads-restore.tar.gz
docker exec strapi_prod sh -c "tar xzf /tmp/uploads-restore.tar.gz -C /app/public/uploads"
docker exec strapi_prod rm -f /tmp/uploads-restore.tar.gz
docker exec strapi_prod sh -c "ls /app/public/uploads | head"   # sanity: files present
```

### 5.8 Bring up the rest (frontend, nginx, certbot)
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
docker compose -f docker-compose.prod.yml ps
```
All services should be `running`/`healthy`.

---

## 6. Verify the live site

```bash
# Backend reachable through nginx/TLS
curl -fsSI https://ovdjejekosarkasve.com | head -1
curl -fsS  https://ovdjejekosarkasve.com/api/players?pagination[limit]=1 | head -c 300; echo

# A stats endpoint (now computed at query time)
curl -fsS  https://ovdjejekosarkasve.com/api/stats/... | head -c 300; echo   # use a real stats route
```
Then in a browser:
- Home / team / player pages load
- Player & team **stat tables** render (these now hit query-time aggregation, not MVs)
- **Uploaded images** display (validates the uploads restore)
- Log into the Strapi admin (validates `ADMIN_JWT_SECRET`/`APP_KEYS` carried over)

---

## 7. Post-deploy

### 7.1 Re-enable scheduled backups (now targeting the prod stack)
```bash
make install-backup-timer
systemctl list-timers zadar-backup.timer
```
This uses `scripts/backups/backup.sh` (→ `backups/prod/`) which now resolves the running stack via
`docker-compose.prod.yml`. Take one immediate full backup to seed the new location:
```bash
make backup-prod-full
ls -lh backups/prod/
```

### 7.2 SSL note
Certs were preserved via the `./certbot/conf` bind-mount. The certbot sidecar auto-renews and nginx
reloads every 6h. Only if certs were missing (step 3.3 WARN) follow the from-scratch re-issuance in
`README.deploy.md` → "SSL certificates".

### 7.3 Clean up the old volumes — ONLY after a few days of confidence
Keep them as a rollback path first. When you're sure:
```bash
docker volume ls | grep -E 'postgres_prod_data|strapi_uploads'   # identify the OLD <dir>_* ones
docker volume rm <dir>_postgres_prod_data <dir>_strapi_uploads
```
Also retire the legacy artifacts from the working tree if desired (`docker-compose.vps.yml` is
already gone from `main`).

---

## Appendix A. De-duplicating source data (REQUIRED — do this before migrating)

**Symptom:** applying the MVs against the prod backup fails, and the Redis cache never flushes.

**Mechanism:** the 4 boxscore views build fine, but `zz_layer1_indexes.sql` creates **unique**
indexes (`player_id+game_id`, `team_id+game_id`, `coach_id+game_id+coach_role`, `game_id`) that are
mandatory for `REFRESH ... CONCURRENTLY`. Duplicate source rows make `CREATE UNIQUE INDEX` fail,
which aborts the whole apply — so the indexes don't exist, the refresh endpoint throws
(relation/“cannot refresh concurrently”), and the `flushCache()` call at the end of
`refresh.ts` never runs. (The runtime refresh has a non-concurrent fallback, but it can't save a
DB where the MVs/indexes were never set up.)

**This is also a correctness bug, not just an index nuisance:** a duplicate `player_stats` row means
that player's points/rebounds are *double-counted* in every aggregation. Fixing the data is the
right move; making the index non-unique would only hide it.

**Where to fix it:** ideally fix it **in production before you take the backup in §2.3**, so the
dump is already clean. Validate the exact fixes on your dev/staging copy first (it already has the
prod backup loaded). If you'd rather fix during the cutover, do it between §5.4 and §5.6.

### A.1 Enumerate the duplicate keys (the 4 boxscore MVs exist even when the index failed)
```bash
C=postgres_prod   # or postgres_staging on your dev/staging box
for q in \
 "player_boxscore|player_id, game_id" \
 "team_boxscore|team_id, game_id" \
 "coach_boxscore|coach_id, game_id, coach_role" \
 "schedule|game_id"; do
  V=${q%%|*}; K=${q##*|}
  echo "== $V dup on ($K) =="
  docker exec $C psql -U strapi -d strapi -c \
    "SELECT $K, count(*) FROM public.$V GROUP BY $K HAVING count(*)>1 ORDER BY count(*) DESC;"
done
```

### A.2 Find the ROOT CAUSE — two different causes, two different fixes

**Cause 1 — genuine duplicate stat records** (same player/team entered twice for one game). These
are the rows to delete; the `array_agg` shows you the competing record ids to compare:
```sql
-- duplicate player_stats
SELECT plnk.player_id, glnk.game_id, count(*) AS rows, array_agg(ps.id ORDER BY ps.id) AS player_stat_ids
FROM player_stats ps
JOIN player_stats_player_lnk plnk ON plnk.player_stat_id = ps.id
JOIN player_stats_game_lnk   glnk ON glnk.player_stat_id = ps.id
GROUP BY 1,2 HAVING count(*) > 1;

-- duplicate team_stats
SELECT tlnk.team_id, glnk.game_id, count(*) AS rows, array_agg(ts.id ORDER BY ts.id) AS team_stat_ids
FROM team_stats ts
JOIN team_stats_team_lnk tlnk ON tlnk.team_stat_id = ts.id
JOIN team_stats_game_lnk glnk ON glnk.team_stat_id = ts.id
GROUP BY 1,2 HAVING count(*) > 1;
```

**Cause 2 — a single-relation game link fanned out** (a game linked to two home teams / venues /
competitions, etc.). This duplicates `schedule.game_id` and can also multiply every player/team row
for that game:
```sql
SELECT 'home_team'   AS rel, game_id, count(*) FROM games_home_team_lnk   GROUP BY game_id HAVING count(*)>1
UNION ALL SELECT 'away_team',   game_id, count(*) FROM games_away_team_lnk   GROUP BY game_id HAVING count(*)>1
UNION ALL SELECT 'venue',       game_id, count(*) FROM games_venue_lnk       GROUP BY game_id HAVING count(*)>1
UNION ALL SELECT 'competition', game_id, count(*) FROM games_competition_lnk GROUP BY game_id HAVING count(*)>1
ORDER BY 1;
```

### A.3 Fix

**Cause 1 (preferred path):** delete the wrong duplicate **through the Strapi admin** (Player-Stats /
Team-Stats collection → open the two entries for that game → keep the correct one, delete the other).
Strapi removes the linked rows cleanly. Compare the two records first — one may be a correction with
fuller stats; keep that one.

If you must do it in SQL, delete by the specific `player_stats.id` / `team_stats.id` you chose to
drop (FKs on the `*_lnk` tables cascade):
```sql
-- example: keep the lower id, delete the other(s) you identified in A.2
DELETE FROM player_stats WHERE id = <the_duplicate_id_to_remove>;
```

**Cause 2:** inspect which link is wrong. If the two link rows point at the *same* target it's a pure
duplicate and you can drop the extra; if they point at *different* targets, a human must decide which
is correct (delete the wrong relation in the Strapi admin → Game entry). Pure-duplicate cleanup:
```sql
-- keep one link row per game (run only after confirming both rows target the SAME team/venue)
DELETE FROM games_home_team_lnk a USING games_home_team_lnk b
WHERE a.ctid < b.ctid AND a.game_id = b.game_id;
```

### A.4 Re-verify, then refresh
```bash
# rebuild MV contents (non-concurrent is fine — the unique index doesn't exist yet)
docker exec $C psql -U strapi -d strapi -c "REFRESH MATERIALIZED VIEW public.player_boxscore;"
docker exec $C psql -U strapi -d strapi -c "REFRESH MATERIALIZED VIEW public.team_boxscore;"
docker exec $C psql -U strapi -d strapi -c "REFRESH MATERIALIZED VIEW public.coach_boxscore;"
docker exec $C psql -U strapi -d strapi -c "REFRESH MATERIALIZED VIEW public.schedule;"
```
Re-run A.1 — every query must return **0 rows**. Only then is the unique-index step (§5.6 /
`apply-mvs --force`) guaranteed to succeed.

---

## 8. Rollback plan

**If something fails before step 4 (old stack still up):** nothing to undo — just don't proceed.

**If it fails during/after the new stack is up:** the old data volumes are intact.
```bash
# Tear down the new stack (KEEP its volumes for diagnosis; no -v)
docker compose -f docker-compose.prod.yml --env-file .env.prod down

# Bring the old stack back exactly as before
git checkout live
docker compose -f docker-compose.vps.yml up -d
```
Because the new stack used **separate** `zadar-museum-prod_*` volumes, the old
`<dir>_*` volumes were never modified — the site returns to its pre-migration state.

**Worst case (volumes damaged):** rebuild from the off-box backup in `~/zadar-premigration` /
your laptop copy using the same restore commands in §5.3 and §5.7.

---

## Why this is not a simple `git pull`

1. **Volumes are renamed by the compose project name.** `docker-compose.vps.yml` has no top-level
   `name:`, so Compose names its volumes after the directory (`<dir>_postgres_prod_data`).
   `docker-compose.prod.yml` sets `name: zadar-museum-prod`, so Compose looks for
   `zadar-museum-prod_postgres_prod_data` — which doesn't exist yet and is created **empty**.
   Result of a naive switch: empty database and missing images. The dump → restore in this guide
   moves the data across the volume boundary explicitly.

2. **`apply-mvs` only adds the 5 new views; it never removes the old ~345.** A restored dump
   contains all the old MVs. Beyond being dead weight, they reference Strapi table columns — and if
   the overhaul's content-type changes alter those columns, Strapi's startup migration can fail with
   "cannot alter/drop column ... other objects depend on it." Dropping every MV *before* starting the
   new backend removes that failure mode entirely.

3. **`:latest` tracks `staging`, not `main`.** Both GHCR workflows fire only on `push` to `staging`
   (and only for `backend/**`/`frontend/**` changes). Merging staging→main builds nothing, so the
   VPS would pull a stale image unless you confirm `:latest` reflects the overhaul and deploy a
   `main` that equals the image-producing staging commit.
</content>
</invoke>
