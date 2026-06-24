# Zadar Basketball Museum

A web application for managing and browsing historical Croatian basketball data — players, teams, games, coaches, referees, venues, leagues, and aggregated statistics.

This is a monorepo containing a **Strapi 5** backend, a **React + Vite** frontend, **PostgreSQL** with materialized views for base boxscore data, **Redis**, and **Docker Compose** stacks for every environment.

> Production runs at **https://ovdjejekosarkasve.com**.

---

## Table of contents

- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Environments & Docker Compose files](#environments--docker-compose-files)
- [Local development quickstart](#local-development-quickstart)
- [Managing the project (Makefile)](#managing-the-project-makefile)
- [Deployment (production / VPS)](#deployment-production--vps)
- [Backups & restore](#backups--restore)
- [Database & materialized views](#database--materialized-views)
- [Copying production data to your machine (UTF-8 safe)](#copying-production-data-to-your-machine-utf-8-safe)
- [Manual VPS operations (no Make target)](#manual-vps-operations-no-make-target)
- [Further reading](#further-reading)

---

## Architecture

```
                         ┌─────────────┐
   Browser ──HTTPS──►    │    nginx    │  (prod: 80/443 + Let's Encrypt)
                         └──────┬──────┘
                  ┌─────────────┼──────────────┐
                  ▼                             ▼
          ┌───────────────┐            ┌────────────────┐
          │   frontend    │            │    backend     │
          │  React + Vite │            │   Strapi 5     │
          │  (static)     │            │  (Node, 1337)  │
          └───────────────┘            └───────┬────────┘
                                       ┌────────┴────────┐
                                       ▼                 ▼
                                ┌────────────┐    ┌────────────┐
                                │ PostgreSQL │    │   Redis    │
                                │  + matviews│    └────────────┘
                                └────────────┘
```

**Backend — Strapi 5 (`backend/`)**
- Standard Strapi content-types per entity under `src/api/{entity}/`.
- **Auth model:** all `GET` routes are public; all writes (`POST`/`PUT`/`DELETE`) are gated by the `global::require-auth-for-writes` policy. Any authenticated Strapi user can write (no per-role granularity).
- **Validation:** input is validated at the service layer with Zod schemas in `src/validation/`.
- **Aggregated stats** (player/team totals, records, coach/referee/venue/league rankings) are computed **at query time** in `src/lib/aggregation/queries.ts`, reading from the base materialized views via Knex (`strapi.db.connection`).

**Frontend — React + Vite (`frontend/`)**
- Routing under `src/routes/` (entity pages, `/dashboard/*` CRUD forms, `/stats/*` tables); all wrapped in `ProtectedRoute`.
- Data fetching via TanStack Query v5 (`UseQueryWithToast` wrapper); hooks in `src/hooks/queries/{entity}/`.
- Central Axios client (`src/lib/ApiClient.ts`) attaches the JWT from `localStorage` and redirects to `/login` on 401.
- API paths centralized in `src/constants/Routes.ts`; base `/api` is proxied by nginx (or Vite's dev proxy).

**Database — PostgreSQL + materialized views**
- Strapi owns its own tables. On top of those, the SQL in `sql/Layer 1/` defines base boxscore views: `player_boxscore`, `team_boxscore`, `coach_boxscore`, `schedule` (+ indexes).
- `backend/scripts/apply-mvs.js` creates/refreshes those views; run it with `make dev-mv` / `make apply-mvs-*`.

---

## Repository layout

| Path | Contents |
|------|----------|
| `backend/` | Strapi app: API content-types, controllers/services/routes, validation, aggregation queries, `scripts/` |
| `frontend/` | React + Vite app: routes, hooks, services, components |
| `sql/Layer 1/` | SQL source for the base materialized views |
| `nginx/` | nginx config variants (`nginx.local.conf`, `nginx.prod.conf`, `nginx.staging.conf`, `nginx.ssl-init.conf`) |
| `scripts/` | Deploy/backup/image-push helpers; `scripts/backups/` holds backup/restore tooling + systemd units |
| `docker-compose.*.yml` | Per-environment service stacks (see below) |
| `Makefile` | Wraps every compose-file + env-file pair into named targets |
| `.env.*` | Per-environment variables (`.env.dev`, `.env.staging`, `.env.prod`; examples committed) |

---

## Environments & Docker Compose files

| File | Project name | Images | Purpose | Started by |
|------|-------------|--------|---------|-----------|
| `docker-compose.dev.yml` | `zadar-development` | built locally | Day-to-day local development | `make dev` |
| `docker-compose.yml` (+ `…local.override.yml`) | default | built locally | Legacy/alt local stack with an nginx proxy on `:8080` | manual `docker compose -f …` |
| `docker-compose.staging.yml` | `zadar-museum-staging` | GHCR (pulled) | Staging mirror of prod (HTTP only) | `make staging` |
| `docker-compose.prod.yml` | `zadar-museum-prod` | GHCR (pulled) | **Production on the VPS** (SSL) | `make prod` |

### `docker-compose.dev.yml` — local development
- **Services:** `postgres` (5432), `redis`, `backend` (1337), `frontend` (5173), `pgadmin` (5051).
- Builds backend/frontend from their `Dockerfile` **`development`** targets.
- **Hot reload:** source is bind-mounted with `node_modules` in named volumes; Strapi runs `npm run develop`, Vite runs `npm run dev`. No nginx — you hit the ports directly.

### `docker-compose.yml` + `docker-compose.local.override.yml` — legacy local stack
- Base: `postgres_dev`, `strapi_dev` (1337), `react_dev` (5173), `nginx_dev` (`8080→80` via `nginx.local.conf`). No Redis/pgAdmin/healthchecks.
- The override adds an HTTP-only nginx, an idle certbot, and a localhost `CORS_ORIGINS` for testing the proxy without TLS.
- Not wired into the Makefile — run it explicitly with both `-f` files. **Prefer `make dev`.**

### `docker-compose.staging.yml` — staging
- `postgres_staging`, `redis_staging`, `backend`/`frontend` from **GHCR**, `nginx_staging` (port 80).
- Healthchecks and `deploy.resources.limits` on every service. HTTP only.

### `docker-compose.prod.yml` — production ⭐
- `postgres_prod` (pinned `15.4`), `redis_prod`, `backend`/`frontend` from **GHCR**, `nginx_prod` (80 + 443), `certbot` sidecar.
- **SSL:** nginx mounts `nginx/nginx.prod.conf` + the `./certbot/conf` & `./certbot/www` volumes. certbot renews every 12 h; nginx reloads every 6 h to pick up renewed certs.
- Healthchecks, resource limits, and JSON-file **log rotation** (10 m × 3) on all services; backend waits for `postgres`/`redis` to be healthy.

> Backend/frontend images are published to GHCR automatically by `.github/workflows/publish-{backend,frontend}.yml` on push to the **`staging`** branch.

---

## Local development quickstart

```bash
make dev          # build + start postgres, redis, backend, frontend, pgadmin
make dev-logs-backend   # tail backend logs
make dev-stop     # stop the stack
```

Services:
- Frontend → http://localhost:5173
- Backend / Strapi admin → http://localhost:1337/admin
- pgAdmin → http://localhost:5051

To run a sub-project outside Docker, see [`README.local.md`](README.local.md).

---

## Managing the project (Makefile)

Run `make help` for the full list. The main targets:

**Lifecycle**
| Target | Action |
|--------|--------|
| `make dev` / `make dev-stop` | Start / stop the dev stack |
| `make staging` / `make staging-stop` | Start / stop staging |
| `make prod` / `make prod-stop` | Pull + deploy / tear down production |

**Logs & utilities**
| Target | Action |
|--------|--------|
| `make dev-logs-backend` · `dev-logs-postgres` · `dev-logs-frontend` | Follow container logs |
| `make dev-enable-unaccent` | Enable the Postgres `unaccent` extension in dev |

**Materialized views**
| Target | Action |
|--------|--------|
| `make dev-mv` | Refresh the Layer 1 views against the running dev DB |
| `make apply-mvs` / `apply-mvs-staging` / `apply-mvs-prod` | Apply/refresh views for the given env |

**Backups & restore**
| Target | Action |
|--------|--------|
| `make backup-dev` / `backup-staging` / `backup-prod` | Quick single-file `pg_dump` → `zadar-backup.sql` (ad-hoc, overwrites) |
| `make backup-prod-full` | **Timestamped DB + uploads** → `backups/prod/`, keeps last 15 |
| `make restore-prod` | Restore the latest `backups/prod/` pair into running prod |
| `make restore-dev-from-vps` | Restore the latest `backups/vps/` pair into dev |
| `make install-backup-timer` | Install the systemd timer (backups every 2 days) on the VPS |
| `make load-*-backup` / `import-*-backup` | Copy `zadar-backup.sql` into a container, then `psql`-import it |

---

## Deployment (production / VPS)

Production uses prebuilt GHCR images, so deployment is **pull + recreate** (no on-VPS build):

```bash
cd /path/to/zadar-museum
git pull origin main
make backup-prod-full        # always back up before changing anything
make prod                    # pull :latest images and recreate the stack
```

`make prod` requires `.env.prod` (create it from `.env.prod.example`). It runs
`docker compose -f docker-compose.prod.yml --env-file .env.prod pull` then
`up -d --no-deps --force-recreate`.

After a deploy that changes the materialized-view SQL:

```bash
make apply-mvs-prod
```

Full deployment notes — including the temporary Node-container MV runner and SSL re-issuance — are in [`README.deploy.md`](README.deploy.md).

---

## Backups & restore

Backups write **timestamped** files to `backups/prod/` (a DB dump + an uploads archive) and keep the most recent 15 of each.

```bash
make backup-prod-full    # manual full backup (DB + uploads)
make restore-prod        # restore the latest backups/prod/ pair into running prod
```

**Scheduled (every 2 days)** — install the systemd timer on the VPS:

```bash
make install-backup-timer
systemctl list-timers zadar-backup.timer   # verify it is scheduled
```

Plain-cron alternative:

```cron
# Every 2 days at 03:00 — adjust the path to your deploy directory
0 3 */2 * * cd /path/to/zadar-museum && ./scripts/backups/backup.sh >> /var/log/zadar-backup.log 2>&1
```

> **Storage note:** backups currently live on the VPS disk only. For real durability, sync `backups/prod/` off-box (e.g. `restic`/`rclone` to object storage) — a future addition.

---

## Database & materialized views

The Layer 1 views (`player_boxscore`, `team_boxscore`, `coach_boxscore`, `schedule`) are created/refreshed by `backend/scripts/apply-mvs.js`.

Via Make (recommended):

```bash
make dev-mv            # refresh against the running dev DB
make apply-mvs-prod    # apply/refresh for production
```

Via the backend script directly (flags forwarded to `apply-mvs.js`):

```bash
cd backend
npm run migrate:mvs                          # create if missing
npm run migrate:mvs -- --refresh             # REFRESH existing views
npm run migrate:mvs -- --force               # DROP + recreate from SQL
npm run migrate:mvs -- --refresh --concurrent  # concurrent refresh (falls back if no unique index)
```

---

## Copying production data to your machine (UTF-8 safe)

Croatian characters (`š`, `ć`, `đ`) get corrupted if a dump is re-encoded in transit — especially on Windows/PowerShell. Use binary-safe steps.

**1. Dump on the VPS** (substitute your `.env.prod` DB user/name):

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U "$DB_USER" -d "$DB_NAME" --encoding=UTF8 --clean --if-exists > zadar_backup.sql
```

**2. Copy it down** (replace `<vps-host>` and paths):

```bash
scp <vps-host>:/path/to/zadar-museum/zadar_backup.sql ./
```

**3. Import into your local dev DB.** The Makefile wraps the binary-safe path — drop the dump in the repo root as `zadar-backup.sql` and run:

```bash
make load-dev-backup     # docker cp the file into the postgres container
make import-dev-backup   # psql import with PGCLIENTENCODING=UTF8
```

Or do it manually with forced UTF-8 (PowerShell example):

```powershell
docker cp ".\zadar_backup.sql" postgres_dev:/tmp/zadar_backup.sql
docker exec -e PGCLIENTENCODING=UTF8 postgres_dev sh -c "psql -U strapi -d strapi -f /tmp/zadar_backup.sql"
```

Quick check after import:

```bash
docker exec postgres_dev psql -U strapi -d strapi -c "SHOW server_encoding; SHOW client_encoding;"
```

> For a full DB **and uploads** restore in one step, prefer `make restore-dev-from-vps` (reads the latest pair from `backups/vps/`).

---

## Manual VPS operations (no Make target)

These are intentionally not wrapped (rare, or destructive). Substitute your `.env.prod` DB user/name where shown.

**List materialized views:**

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  psql -U "$DB_USER" -d "$DB_NAME" -c \
  "SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY 1,2;"
```

**Recreate a single service** (e.g. just the frontend) without touching the rest:

```bash
docker compose -f docker-compose.prod.yml pull frontend
docker compose -f docker-compose.prod.yml up -d --no-deps --force-recreate frontend
```

**Free disk space** (removes dangling images; does not touch volumes):

```bash
docker image prune -a -f
```

**Recover from Docker daemon metadata errors:**

```bash
systemctl restart docker && sleep 3
```

**Drop all materialized views in `public`** (⚠️ destructive — only when rebuilding from SQL):

```sql
docker exec -it postgres_prod psql -U "$DB_USER" -d "$DB_NAME"
-- then:
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT matviewname FROM pg_matviews WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP MATERIALIZED VIEW IF EXISTS public.' || quote_ident(r.matviewname) || ' CASCADE';
  END LOOP;
END $$;
```

---

## Further reading

- [`README.local.md`](README.local.md) — running sub-projects outside Docker, MV migration flags
- [`README.deploy.md`](README.deploy.md) — detailed VPS deploy, MV runner, SSL re-issuance, backup scheduling
- [`CLAUDE.md`](CLAUDE.md) — full architecture and contributor guidance
- `backend/README.md`, `frontend/README.md` — sub-project specifics
