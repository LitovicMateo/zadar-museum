# Design: consolidate to `prod.yml`, harden Docker, fix SSL renewal, automated backups

**Date:** 2026-06-24
**Status:** Approved for planning
**Scope:** Production deployment infrastructure (Docker Compose, nginx, SSL, backups). No application code changes.

## Problem

The VPS currently runs `docker-compose.vps.yml`, while `docker-compose.prod.yml` is a different, unrelated local-build test file. This is semantically confusing and means `make prod` does **not** deploy what actually runs in production. Alongside this naming problem, the review surfaced concrete gaps:

- **No automated media/uploads backup.** Only the Postgres DB has a backup script; the `strapi_uploads` volume (~400 MB) has a *restore* path but no *backup* path.
- **No timestamping or retention** on backups — each run overwrites a single file.
- **SSL renewal is broken in practice.** The certbot sidecar renews certs, but nginx is never reloaded, so renewed certs are not served until a manual restart.
- **Production is less hardened than staging** — no healthchecks, no resource limits, no log rotation, no Redis, floating Postgres image tag.
- **Backend Dockerfile inefficiencies** — missing `.dockerignore`, and a production-deps install that is immediately clobbered by a full `node_modules` copy.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| SSL state | Certs already issued and working → fix renewal-reload only; do not bootstrap from scratch |
| Backup storage | VPS local only for now (offsite-ready design, not wired) |
| File layout | `docker-compose.prod.yml` becomes the real prod file; delete `docker-compose.vps.yml` and the old local-build `prod.yml` content |
| Redis in prod | Yes — provision container + `REDIS_URL` now (matching staging) |
| Backend runs as | root for now (non-root deferred — volume permission risk) |
| Backup location | `backups/prod/` in the project dir (mirrors existing `backups/vps/`, already gitignored) |
| Retention | Keep last 15 backup pairs (~30 days at every-2-days), configurable |
| Backup DB format | Plain `.sql` (DB ~4 MB) + gzipped uploads tar — keeps existing restore script working |
| Scheduling | systemd timer every 2 days at 03:00; cron alternative documented |

## A. File restructuring

### New `docker-compose.prod.yml`
Rewritten from the current `docker-compose.vps.yml` content, with these additions:

- **Redis** service (`redis:7-alpine`, `redis-server --save "" --appendonly no`), with healthcheck and resource limits, matching staging.
- **`REDIS_URL: redis://redis:6379`** added to the backend environment; `redis` added to backend `depends_on`.
- **Healthchecks** on postgres (`pg_isready`), backend (`curl -f http://127.0.0.1:1337/admin`), and frontend (index.html exists), matching staging.
- **`deploy.resources.limits`** on each service, matching staging values (backend/frontend 0.50 CPU / 512M; redis/nginx 0.25 CPU / 128M; postgres reasonable default).
- **Log rotation** on every service: `logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }`.
- **Pinned Postgres image**: `postgres:15.4-alpine` (was floating `15-alpine`).
- **`depends_on` with `condition: service_healthy`** where a healthcheck exists.
- nginx volume mount updated to `./nginx/nginx.prod.conf` and the renewal-reload command (see §E).
- Keeps: GHCR images for backend/frontend, certbot sidecar, ports 80/443, named volumes `postgres_prod_data` + `strapi_uploads`, certbot `./certbot/conf` + `./certbot/www` mounts.

### `nginx/nginx.prod.conf`
Replaced with the current `nginx.vps.conf` content (the working SSL config for `ovdjejekosarkasve.com`) plus the renewal-reload change in §E. This file is currently the local-build, port-80, no-SSL config and becomes orphaned once the old prod.yml is removed, so it is safe to overwrite.

### Deletions
- `docker-compose.vps.yml`
- The old local-build `docker-compose.prod.yml` content (replaced in place by the new prod stack)
- `nginx/nginx.vps.conf`
- `nginx/nginx.vps.conf.vps.bak` (already gitignored; remove from disk for cleanliness)

### Makefile
No structural change needed — `PROD_COMPOSE := docker-compose.prod.yml` already exists and `make prod` already does `pull` + `up -d --no-deps --force-recreate` against it, which is correct for GHCR-image deployment. New backup targets are added (see §C/§D).

### Docs
- `README.deploy.md` — replace `docker-compose.vps.yml` references with `docker-compose.prod.yml`; document the new backup commands and timer.
- `CLAUDE.md` — update the Docker Compose Environments table: drop the `docker-compose.vps.yml` row; note that `docker-compose.prod.yml` is the real production stack.

## B. Backend Dockerfile

1. **Add `backend/.dockerignore`** covering at minimum: `node_modules`, `.git`, `.gitignore`, `.tmp`, `.cache`, `dist`, `build`, `*.log`, `.env*`, `types`. Fixes `COPY . .` pulling host `node_modules`/`.git` into the image and clobbering the clean `npm ci`.
2. **Fix the runtime deps step.** Remove the redundant `npm ci --only=production` (line 42) — it is overwritten by `COPY --from=builder /app .` (line 46). After the copy, run **`npm prune --omit=dev`** to strip dev dependencies from the runtime image.
3. **Add `HEALTHCHECK`** to the runtime stage (curl is already installed): `curl -f http://127.0.0.1:1337/admin || exit 1`.

Not changed: `USER` stays root (non-root deferred — mounted `strapi_uploads` volume write-permission risk needs separate testing). The admin-build copy hack and the multi-stage structure are preserved.

## C. Backup overhaul (DB and media)

New script **`scripts/backups/backup.sh`**:

- Accepts `--compose-file` / `--env-file` (defaults to prod) and an output dir (default `backups/prod/`).
- Resolves the running `postgres` and `backend` containers via compose.
- **DB:** `pg_dump` (plain SQL) → `backups/prod/db-<YYYYMMDD_HHMMSS>.sql`, reading the password from the env file like the existing `pg_backup.sh`.
- **Uploads:** archive the `strapi_uploads` volume contents → `backups/prod/uploads-<YYYYMMDD_HHMMSS>.tar.gz` (tar from inside the backend container, or via a throwaway container mounting the volume).
- **Retention:** after a successful backup, prune to the most recent **15** `db-*.sql` and **15** `uploads-*.tar.gz` (configurable `RETENTION=15` at the top of the script).
- Timestamps on the DB and uploads files share the same run timestamp so a pair is identifiable.
- Output filenames (`*.sql`, `*.tar.gz`) remain compatible with the existing `restore-dev-from-vps.sh` "latest" globbing.

New Makefile targets:
- **`backup-prod`** — runs `backup.sh` against the prod stack (DB + uploads, timestamped, with retention).
- **`restore-prod`** — restores the latest `backups/prod/` pair into the running prod stack (a prod-targeted sibling of `restore-dev-from-vps.sh`).

The existing single-file `backup-dev/staging/prod` targets stay as-is for ad-hoc dumps.

## D. Timed backups (every 2 days)

Provided as **systemd units** for the VPS:

- `scripts/backups/systemd/zadar-backup.service` — `Type=oneshot`, runs `backup.sh` from the deploy directory.
- `scripts/backups/systemd/zadar-backup.timer` — `OnCalendar` firing every 2 days at 03:00, `Persistent=true` (catches up if the VPS was off).
- **`make install-backup-timer`** — copies the units into `/etc/systemd/system/`, runs `systemctl daemon-reload`, and enables + starts the timer.
- A plain-cron equivalent is documented in `README.deploy.md` for users who prefer cron.

Offsite sync is intentionally out of scope but the script's single output dir makes a future `rclone`/`restic` step a one-liner addition.

## E. SSL renewal fix

Certs already work; this only fixes the renewal-reload gap.

- **nginx container** command changed to reload every 6 h so renewed certs are picked up automatically, using the standard pattern:
  `/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g "daemon off;"'`
- **certbot sidecar** keeps its existing 12 h `certbot renew` loop, unchanged.
- A `make ssl-init` target and its `nginx.ssl-init.conf` bootstrap flow are **documented** in `README.deploy.md` for future from-scratch re-issuance, but not run (current certs are valid).

## Out of scope

- Frontend Dockerfile (already clean: multi-stage, has `.dockerignore`, build arg).
- dev / staging compose behavior.
- The materialized-view / `apply-mvs` flow.
- Actual Redis *integration* in backend application code (planned separately) — this only provisions the container and `REDIS_URL`.
- Offsite/cloud backup sync (local-only for now by decision).
- Switching the backend container to a non-root user.

## Verification / success criteria

- `docker compose -f docker-compose.prod.yml config` validates (with `.env.prod`).
- `docker-compose.vps.yml`, old local-build `prod.yml` content, `nginx.vps.conf`, and `*.vps.bak` are gone; no remaining references to them in Makefile/README/CLAUDE.md.
- `make backup-prod` produces a timestamped `db-*.sql` + `uploads-*.tar.gz` pair in `backups/prod/` and prunes beyond 15.
- `make restore-prod` restores the latest pair into a running prod stack.
- nginx config still serves HTTPS for `ovdjejekosarkasve.com` and reloads on the 6 h loop.
- Backend image builds with the new `.dockerignore` and ships without dev dependencies (`npm prune --omit=dev` applied).
- systemd timer installs and `systemctl list-timers` shows `zadar-backup.timer` scheduled.
