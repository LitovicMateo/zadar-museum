# Production migration — quarters / halves period format

Deploy guide for the `period_format` + `firstHalf`/`secondHalf` refactor.

Rebuilding containers gets you the new *columns* and nothing else. Three things do not happen automatically:

- **`period_format` is never backfilled.** In dev, all 119 games stayed `NULL` despite `default: 'quarters'` — Strapi only applies defaults to new rows.
- **The data move is a one-shot script.** Nothing runs `sql/migrations/001_period_format.sql` for you.
- **`apply-mvs` skips views that already exist.** `team_boxscore` has a new definition, but the script will log *"already exists — skipping creation"* and leave the old one in place forever.

---

## Blocker before anything else

`.github/workflows/publish-frontend.yml:29` runs `npm ci && npm run build` as a validation gate, and that build **currently fails** on the uncommitted `LeagueSeasonStats.tsx:94` (`stats.neutral` is optional, `?.games ?? 0` doesn't narrow it). CI won't produce a frontend image until that's fixed.

Images publish on push to **`staging`**, tagged `:latest` — prod pulls `:latest`.

---

## Step by step

### 1. Pre-flight on prod (read-only, do this first)

The `season < '2000'` rule is a *string* comparison, and dev only had 5 seasons. Verify prod's data actually fits:

```bash
docker exec postgres_prod psql -U strapi -d strapi -c "
SELECT season, count(*) FROM games GROUP BY 1 ORDER BY 1;
SELECT count(*) AS non_numeric FROM games WHERE season !~ '^[0-9]{4}$';"
```

If `non_numeric > 0` (e.g. a `95/96`-style season), **stop** — the rule needs adjusting before going further.

Also check the duplicates that aborted the dev run, because `zz_layer1_indexes.sql` throws a hard error on them and kills the whole apply:

```bash
docker exec postgres_prod psql -U strapi -d strapi -c "
SELECT 'player' src, player_id::text, game_id, count(*) FROM player_boxscore GROUP BY 1,2,3 HAVING count(*)>1
UNION ALL SELECT 'team', team_id::text, game_id, count(*) FROM team_boxscore GROUP BY 1,2,3 HAVING count(*)>1;"
```

### 2. Rehearse on staging

`make restore-staging` drops, imports a prod dump, and applies MVs. Run steps 4–8 there against real prod data first. This validates the season rule for free.

### 3. Back up prod

```bash
make backup-prod-full     # timestamped DB + uploads -> backups/prod/, keeps 15
```

Also snapshot the scores now, for the parity check in step 9:

```bash
docker exec postgres_prod psql -U strapi -d strapi -At -F'|' \
  -c "SELECT game_id, team_id, score FROM team_boxscore ORDER BY 1,2;" > scores_before.txt
```

### 4. Deploy the code

Merge to `staging`, let CI publish, then on the VPS:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
docker logs -f strapi_prod    # wait for "Strapi started successfully"
```

Strapi syncs content-type schema on boot in production too, so this creates `period_format`, `first_half`, `second_half`.

### 5. Confirm the columns exist

Do this *before* migrating:

```bash
docker exec postgres_prod psql -U strapi -d strapi -c "\d games" | grep period_format
docker exec postgres_prod psql -U strapi -d strapi -c "\d team_stats" | grep -E "first_half|second_half"
```

### 6. Run the migration

Idempotent, safe to re-run:

```bash
docker cp sql/migrations/001_period_format.sql postgres_prod:/tmp/
docker exec postgres_prod psql -U strapi -d strapi -v ON_ERROR_STOP=1 -f /tmp/001_period_format.sql
```

### 7. Rebuild `team_boxscore` — do NOT use `--force`

`--force` does `DROP ... CASCADE` and processes files alphabetically, so `schedule` gets created and then destroyed by `team_boxscore`'s cascade. That is what wrecked the dev views. Drop the one changed view explicitly, then let the normal multi-pass run rebuild both in dependency order:

```bash
docker exec postgres_prod psql -U strapi -d strapi -c "DROP MATERIALIZED VIEW team_boxscore CASCADE;"
make apply-mvs-prod
```

If step 1 found duplicates, the run will abort on the unique index and leave indexes missing — re-run the index file tolerantly afterwards:

```bash
docker cp "sql/Layer 1/zz_layer1_indexes.sql" postgres_prod:/tmp/
docker exec postgres_prod psql -U strapi -d strapi -f /tmp/zz_layer1_indexes.sql   # no ON_ERROR_STOP
```

### 8. Flush the Redis cache

Aggregations are cached 24h:

```bash
docker exec redis_prod sh -c "redis-cli --scan --pattern 'app:*' | xargs -r redis-cli del"
```

### 9. Verify

The score-parity check is the one that matters:

```bash
docker exec postgres_prod psql -U strapi -d strapi -At -F'|' \
  -c "SELECT game_id, team_id, score FROM team_boxscore ORDER BY 1,2;" > scores_after.txt
diff scores_before.txt scores_after.txt && echo "✅ no score changed"
```

Then spot-check a pre-2000 game page (should show `1H 2H`, no `3Q 0 / 4Q 0`) and a recent one.

---

## Notes on risk

The window between steps 4 and 6 is safe: `period_format` is NULL, the frontend falls back to `'quarters'`, and you get today's existing behaviour — no crash, no regression. So a maintenance window isn't required, though doing it during quiet hours is sensible.

**Rollback:** steps 4–5 are reversible by re-pinning the previous image SHA. Once step 6 runs, the quarter columns for pre-2000 games are `NULL` and rolling back the code means restoring from step 3's backup — so treat the migration as the point of no return.

---

## Unrelated finding

An **unauthenticated** `PUT /api/games/:id` succeeds. `api::game.game.update` is granted to the **Public** role and `require-auth-for-writes` isn't applied to the core routes, so writes bypass auth entirely. This is true on prod right now and is independent of this deploy.
