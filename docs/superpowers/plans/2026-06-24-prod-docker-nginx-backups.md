# Prod Docker/nginx Consolidation + Backups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `docker-compose.prod.yml` the single, hardened production stack (replacing `docker-compose.vps.yml`), fix the SSL renewal-reload gap, optimize the backend image, and add timestamped DB+media backups with retention and a systemd timer.

**Architecture:** Promote the working `vps.yml` content into `docker-compose.prod.yml` with staging-grade hardening (healthchecks, resource limits, log rotation, Redis, pinned images). nginx reloads on a 6 h loop so renewed certs are served. Backups are produced by a single parametrized shell script writing timestamped files to `backups/prod/` with retention, invoked manually via Make or every 2 days via a systemd timer.

**Tech Stack:** Docker Compose, nginx, Let's Encrypt/certbot, PostgreSQL 15, Redis 7, bash, systemd, GNU Make.

**Verification note:** There is no unit-test framework for infra files. Each task verifies with concrete commands: `bash -n` for shell syntax, `docker compose config` for compose validity, `nginx -t` (in a throwaway container) for nginx config, and grep checks for dangling references. Spec: `docs/superpowers/specs/2026-06-24-prod-docker-nginx-backups-design.md`.

**Spec deviation (noted):** The spec named the new full-backup Make target `backup-prod`, but a single-file `backup-prod` target already exists (used by `load-prod-backup`/`import-prod-backup`). To avoid clobbering it, the new full-backup target is named **`backup-prod-full`**. The systemd service calls `backup.sh` directly, so the timer is unaffected.

---

### Task 1: Backend Dockerfile — `.dockerignore` + runtime fixes

**Files:**
- Create: `backend/.dockerignore`
- Modify: `backend/Dockerfile:36-54` (the `runtime` stage)

- [ ] **Step 1: Create `backend/.dockerignore`**

```
node_modules
.git
.gitignore
.tmp
.cache
dist
build
types
*.log
.env*
```

- [ ] **Step 2: Replace the entire `runtime` stage in `backend/Dockerfile`**

Find the current runtime stage (from `FROM node:20-alpine AS runtime` to the end of the file) and replace it with:

```dockerfile
FROM node:20-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache curl

# Copy the built app (including node_modules) from the builder stage
COPY --from=builder /app .

# Strip dev dependencies from the runtime image
RUN npm prune --omit=dev

# Ensure the admin client build is available where the Strapi server expects it
RUN mkdir -p /app/node_modules/@strapi/admin/dist/server/server/build \
 && cp -r ./dist/build/* /app/node_modules/@strapi/admin/dist/server/server/build/ || true

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -f http://127.0.0.1:1337/admin || exit 1

CMD ["npm", "run", "start"]
```

This removes the redundant `COPY package*.json ./` + `npm ci --only=production` (which were overwritten by the builder copy), replaces them with `npm prune --omit=dev`, and adds a HEALTHCHECK.

- [ ] **Step 3: Verify the Dockerfile parses (syntax check via build of the builder stage only)**

Run: `cd backend && docker build --target builder -t zadar-backend-builder-check . 2>&1 | tail -5`
Expected: builds through the `builder` stage without a Dockerfile parse error (network/npm time is fine; a parse error would fail immediately). If Docker is unavailable in this environment, instead run `grep -n "npm prune --omit=dev" Dockerfile` and confirm it appears once and `--only=production` no longer appears: `grep -c -- "--only=production" Dockerfile` → `0`.

- [ ] **Step 4: Commit**

```bash
git add backend/.dockerignore backend/Dockerfile
git commit -m "perf(backend): add .dockerignore, prune dev deps, add healthcheck"
```

---

### Task 2: nginx prod config (SSL) in place

**Files:**
- Modify (overwrite): `nginx/nginx.prod.conf` ← content of `nginx/nginx.vps.conf`

- [ ] **Step 1: Overwrite `nginx.prod.conf` with the working SSL config**

Run: `cp nginx/nginx.vps.conf nginx/nginx.prod.conf`

(The previous `nginx.prod.conf` was the local-build, port-80, no-SSL config used only by the old local prod compose, which is being removed. The renewal-reload is handled by the nginx container command in Task 3, so the config file itself needs no edit.)

- [ ] **Step 2: Verify nginx accepts the config**

Run:
```bash
docker run --rm -v "$(pwd)/nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t 2>&1 | tail -5
```
Expected: nginx reports the SSL cert files are missing (`cannot load certificate ... /etc/letsencrypt/live/...`) — this is expected locally since certs live on the VPS. The important check: **no syntax errors** (`nginx: configuration file ... test failed` due to *syntax* would name a line; a missing-cert error is acceptable). If Docker is unavailable, run `grep -n "ovdjejekosarkasve.com" nginx/nginx.prod.conf` → confirm the server_name lines are present.

- [ ] **Step 3: Commit**

```bash
git add nginx/nginx.prod.conf
git commit -m "feat(nginx): make nginx.prod.conf the SSL production config"
```

---

### Task 3: Rewrite `docker-compose.prod.yml` as the real production stack

**Files:**
- Modify (overwrite): `docker-compose.prod.yml`

- [ ] **Step 1: Overwrite `docker-compose.prod.yml` with the hardened production stack**

```yaml
name: zadar-museum-prod

services:
  postgres:
    image: postgres:15.4-alpine
    container_name: postgres_prod
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  redis:
    image: redis:7-alpine
    container_name: redis_prod
    command: redis-server --save "" --appendonly no
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: "0.25"
          memory: 128M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  backend:
    image: ghcr.io/litovicmateo/zadar-museum-backend:latest
    container_name: strapi_prod
    volumes:
      - strapi_uploads:/app/public/uploads
    environment:
      DATABASE_HOST: ${DATABASE_HOST}
      DATABASE_PORT: ${DATABASE_PORT}
      DATABASE_NAME: ${DATABASE_NAME}
      DATABASE_USERNAME: ${DATABASE_USERNAME}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
      APP_KEYS: ${APP_KEYS}
      API_TOKEN_SALT: ${API_TOKEN_SALT}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      TRANSFER_TOKEN_SALT: ${TRANSFER_TOKEN_SALT}
      JWT_SECRET: ${JWT_SECRET}
      REDIS_URL: redis://redis:6379
      # Allow configuring CORS origins from the .env file on the host (comma-separated)
      CORS_ORIGINS: ${CORS_ORIGINS}
      NODE_ENV: production
      PUBLIC_URL: ${PUBLIC_URL}
      PROXY: ${PROXY}
    command: npm run start
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://127.0.0.1:1337/admin || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 512M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    image: ghcr.io/litovicmateo/zadar-museum-frontend:latest
    container_name: react_prod
    depends_on:
      - backend
    networks:
      - app_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "[ -f /usr/share/nginx/html/index.html ] || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 512M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  nginx:
    image: nginx:alpine
    container_name: nginx_prod
    command: ["/bin/sh", "-c", "while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g 'daemon off;'"]
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    networks:
      - app_network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "0.25"
          memory: 128M
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  postgres_prod_data:
  strapi_uploads:

networks:
  app_network:
    driver: bridge
```

- [ ] **Step 2: Verify the compose file is valid**

Run:
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod.example config >/dev/null && echo "COMPOSE OK"
```
Expected: prints `COMPOSE OK` (may emit warnings about unset optional vars — acceptable; a structural error would be non-zero exit and no `COMPOSE OK`).

- [ ] **Step 3: Confirm Redis, healthchecks, and log rotation are present**

Run:
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod.example config | grep -E "redis:|REDIS_URL|healthcheck|max-size" | head
```
Expected: shows the `redis` service, `REDIS_URL`, at least one `healthcheck`, and `max-size` logging option.

- [ ] **Step 4: Commit**

```bash
git add docker-compose.prod.yml
git commit -m "feat(prod): promote prod.yml to hardened production stack (redis, healthchecks, limits, log rotation, ssl reload)"
```

---

### Task 4: Remove obsolete files and dangling references

**Files:**
- Delete: `docker-compose.vps.yml`, `nginx/nginx.vps.conf`, `nginx/nginx.vps.conf.vps.bak`

- [ ] **Step 1: Delete the obsolete files**

```bash
git rm docker-compose.vps.yml nginx/nginx.vps.conf
rm -f nginx/nginx.vps.conf.vps.bak
```

(`nginx.vps.conf.vps.bak` is gitignored via `nginx/*.vps.bak`, so it is removed from disk only.)

- [ ] **Step 2: Verify no source/config references the deleted files remain**

Run:
```bash
grep -rn --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=docs \
  -e "docker-compose.vps.yml" -e "nginx.vps.conf" . || echo "NO REFERENCES"
```
Expected: `NO REFERENCES`. (Docs are updated in Task 8; if any non-doc references remain, fix them now — the README/CLAUDE references are handled there.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove obsolete docker-compose.vps.yml and nginx.vps.conf"
```

---

### Task 5: Backup script (DB + uploads, timestamped, retention)

**Files:**
- Create: `scripts/backups/backup.sh`

- [ ] **Step 1: Create `scripts/backups/backup.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail

# Create timestamped Postgres + Strapi uploads backups from a running compose
# stack and prune to a retention limit. Defaults target the production stack.

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"
PG_SERVICE="postgres"
BACKEND_SERVICE="backend"
DB_USER="strapi"
DB_NAME="strapi"
OUTPUT_DIR="backups/prod"
RETENTION=15
UPLOADS_PATH="/app/public/uploads"

usage(){
  cat <<EOF
Usage: $0 [--compose-file FILE] [--env-file FILE] [--output-dir DIR]
          [--retention N] [--db-user USER] [--db-name NAME]

Defaults:
  --compose-file docker-compose.prod.yml
  --env-file .env.prod
  --output-dir backups/prod
  --retention 15
  --db-user strapi
  --db-name strapi
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --compose-file) COMPOSE_FILE="$2"; shift 2;;
    --env-file) ENV_FILE="$2"; shift 2;;
    --output-dir) OUTPUT_DIR="$2"; shift 2;;
    --retention) RETENTION="$2"; shift 2;;
    --db-user) DB_USER="$2"; shift 2;;
    --db-name) DB_NAME="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  COMPOSE_CMD="docker compose"
fi

# Read DB password from the env file (DATABASE_PASSWORD or POSTGRES_PASSWORD)
DB_PASSWORD=""
if [ -f "$ENV_FILE" ]; then
  DB_PASSWORD=$(grep -E '^(DATABASE_PASSWORD|POSTGRES_PASSWORD)=' "$ENV_FILE" | head -n1 | sed -E 's/^[^=]+=//') || true
fi
if [ -z "$DB_PASSWORD" ] && [ -n "${DATABASE_PASSWORD:-}" ]; then
  DB_PASSWORD="$DATABASE_PASSWORD"
fi

mkdir -p "$OUTPUT_DIR"
TS=$(date +%Y%m%d_%H%M%S)

PG_CONTAINER=$($COMPOSE_CMD -f "$COMPOSE_FILE" ps -q "$PG_SERVICE" 2>/dev/null || true)
[ -n "$PG_CONTAINER" ] || { echo "No '$PG_SERVICE' container found (is the stack running?)" >&2; exit 1; }
BACKEND_CONTAINER=$($COMPOSE_CMD -f "$COMPOSE_FILE" ps -q "$BACKEND_SERVICE" 2>/dev/null || true)
[ -n "$BACKEND_CONTAINER" ] || { echo "No '$BACKEND_SERVICE' container found (is the stack running?)" >&2; exit 1; }

DB_OUT="$OUTPUT_DIR/db-$TS.sql"
UP_OUT="$OUTPUT_DIR/uploads-$TS.tar.gz"

echo "Dumping database '$DB_NAME' -> $DB_OUT"
docker exec -i "$PG_CONTAINER" sh -c "export PGPASSWORD='$DB_PASSWORD'; export PGCLIENTENCODING=UTF8; pg_dump -U '$DB_USER' -d '$DB_NAME'" > "$DB_OUT"

echo "Archiving uploads '$UPLOADS_PATH' -> $UP_OUT"
docker exec "$BACKEND_CONTAINER" sh -c "tar czf - -C '$UPLOADS_PATH' ." > "$UP_OUT"

echo "Pruning old backups (keeping last $RETENTION of each type)..."
ls -1t "$OUTPUT_DIR"/db-*.sql 2>/dev/null | tail -n +$((RETENTION + 1)) | xargs -r rm -f
ls -1t "$OUTPUT_DIR"/uploads-*.tar.gz 2>/dev/null | tail -n +$((RETENTION + 1)) | xargs -r rm -f

echo "Backup complete:"
echo "  DB:      $DB_OUT"
echo "  Uploads: $UP_OUT"
```

- [ ] **Step 2: Make it executable and syntax-check**

```bash
chmod +x scripts/backups/backup.sh
bash -n scripts/backups/backup.sh && echo "SYNTAX OK"
```
Expected: prints `SYNTAX OK`.

- [ ] **Step 3: Verify the help text works**

Run: `scripts/backups/backup.sh --help`
Expected: prints the usage block with the listed defaults.

- [ ] **Step 4: Commit**

```bash
git add scripts/backups/backup.sh
git commit -m "feat(backups): add timestamped DB+uploads backup script with retention"
```

---

### Task 6: Restore script + Make targets

**Files:**
- Create: `scripts/backups/restore.sh`
- Modify: `Makefile` (add `backup-prod-full`, `restore-prod`; register in `.PHONY`)

- [ ] **Step 1: Create `scripts/backups/restore.sh`**

This is a parametrized restore (adapted from `restore-dev-from-vps.sh`) defaulting to the prod stack and `backups/prod/`. The existing dev restore script is left untouched.

```bash
#!/usr/bin/env bash
# restore.sh — restore the LATEST db-*.sql + uploads-*.tar.gz from a backup dir
# into a running compose stack, then restart the backend. Defaults to prod.
set -euo pipefail

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"
BACKUP_DIR="backups/prod"
DB_USER="strapi"
DB_NAME="strapi"
UPLOADS_PATH="/app/public/uploads"

usage(){
  cat <<EOF
Usage: $0 [--compose-file FILE] [--env-file FILE] [--backup-dir DIR]
          [--db-user USER] [--db-name NAME]
Defaults: prod stack, backups/prod, user/db 'strapi'
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --compose-file) COMPOSE_FILE="$2"; shift 2;;
    --env-file) ENV_FILE="$2"; shift 2;;
    --backup-dir) BACKUP_DIR="$2"; shift 2;;
    --db-user) DB_USER="$2"; shift 2;;
    --db-name) DB_NAME="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

if command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  COMPOSE_CMD="docker compose"
fi

[ -d "$BACKUP_DIR" ] || { echo "Backup dir not found: $BACKUP_DIR" >&2; exit 1; }

SQL_FILE=$(ls -1t "$BACKUP_DIR"/db-*.sql 2>/dev/null | head -1 || true)
UPLOADS_FILE=$(ls -1t "$BACKUP_DIR"/uploads-*.tar.gz 2>/dev/null | head -1 || true)
[ -n "$SQL_FILE" ]     || { echo "No db-*.sql in $BACKUP_DIR" >&2; exit 1; }
[ -n "$UPLOADS_FILE" ] || { echo "No uploads-*.tar.gz in $BACKUP_DIR" >&2; exit 1; }

echo "Validating uploads archive..."
gzip -t "$UPLOADS_FILE" || { echo "Uploads archive is corrupt: $UPLOADS_FILE" >&2; exit 1; }

PG_CONTAINER=$($COMPOSE_CMD -f "$COMPOSE_FILE" ps -q postgres 2>/dev/null || true)
BACKEND_CONTAINER=$($COMPOSE_CMD -f "$COMPOSE_FILE" ps -q backend 2>/dev/null || true)
[ -n "$PG_CONTAINER" ]      || { echo "No postgres container (is the stack running?)" >&2; exit 1; }
[ -n "$BACKEND_CONTAINER" ] || { echo "No backend container (is the stack running?)" >&2; exit 1; }

echo "Latest DB dump : $(basename "$SQL_FILE")"
echo "Latest uploads : $(basename "$UPLOADS_FILE")"

# --- Restore database ---
TMP_DEST="/tmp/$(basename "$SQL_FILE")"
docker cp "$SQL_FILE" "$PG_CONTAINER:$TMP_DEST"
docker exec "$PG_CONTAINER" psql -U "$DB_USER" -d postgres \
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" >/dev/null
docker exec "$PG_CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec "$PG_CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME WITH OWNER $DB_USER ENCODING 'UTF8';"
docker exec -e PGCLIENTENCODING=UTF8 "$PG_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -f "$TMP_DEST"
docker exec "$PG_CONTAINER" rm -f "$TMP_DEST"
echo "Database restored."

# --- Restore uploads ---
docker exec "$BACKEND_CONTAINER" sh -c "rm -rf $UPLOADS_PATH/* $UPLOADS_PATH/.[!.]* 2>/dev/null || true"
docker cp "$UPLOADS_FILE" "$BACKEND_CONTAINER:/tmp/uploads-restore.tar.gz"
docker exec "$BACKEND_CONTAINER" sh -c "tar xzf /tmp/uploads-restore.tar.gz -C $UPLOADS_PATH"
docker exec "$BACKEND_CONTAINER" rm -f /tmp/uploads-restore.tar.gz
echo "Uploads restored."

# --- Restart backend ---
$COMPOSE_CMD -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart backend
echo "Restore complete; backend restarted."
```

- [ ] **Step 2: Make it executable and syntax-check**

```bash
chmod +x scripts/backups/restore.sh
bash -n scripts/backups/restore.sh && echo "SYNTAX OK"
```
Expected: prints `SYNTAX OK`.

- [ ] **Step 3: Add Make targets**

In `Makefile`, add `backup-prod-full` and `restore-prod` to the `.PHONY` line (append the two names), and add these targets after the existing `backup-prod` block:

```makefile
# Full prod backup (timestamped DB + uploads with retention) -> backups/prod/
backup-prod-full:
	./scripts/backups/backup.sh --compose-file $(PROD_COMPOSE) --env-file $(PROD_ENV) --output-dir backups/prod

# Restore latest backups/prod/ pair into the running prod stack
restore-prod:
	./scripts/backups/restore.sh --compose-file $(PROD_COMPOSE) --env-file $(PROD_ENV) --backup-dir backups/prod
```

- [ ] **Step 4: Verify Make targets are recognized**

Run: `make -n backup-prod-full && make -n restore-prod`
Expected: prints the two script invocations without "No rule to make target" errors.

- [ ] **Step 5: Commit**

```bash
git add scripts/backups/restore.sh Makefile
git commit -m "feat(backups): add restore.sh and backup-prod-full/restore-prod make targets"
```

---

### Task 7: systemd timer (every 2 days) + install target

**Files:**
- Create: `scripts/backups/systemd/zadar-backup.service`
- Create: `scripts/backups/systemd/zadar-backup.timer`
- Modify: `Makefile` (add `install-backup-timer`; register in `.PHONY`)

- [ ] **Step 1: Create `scripts/backups/systemd/zadar-backup.service`**

```ini
[Unit]
Description=Zadar Museum production backup (Postgres + uploads)
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
WorkingDirectory=__PROJECT_ROOT__
ExecStart=/bin/bash __PROJECT_ROOT__/scripts/backups/backup.sh
```

(`__PROJECT_ROOT__` is substituted with the real deploy path by `make install-backup-timer`.)

- [ ] **Step 2: Create `scripts/backups/systemd/zadar-backup.timer`**

```ini
[Unit]
Description=Run Zadar Museum backup every 2 days

[Timer]
OnCalendar=*-*-1/2 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

(`*-*-1/2 03:00:00` fires on odd days of the month at 03:00 — an "every other day" cadence; `Persistent=true` runs a missed backup after downtime.)

- [ ] **Step 3: Add the `install-backup-timer` Make target**

In `Makefile`, add `install-backup-timer` to `.PHONY`, then add:

```makefile
# Install the systemd timer that runs backup.sh every 2 days (run on the VPS)
install-backup-timer:
	@sed 's|__PROJECT_ROOT__|$(PROJECT_ROOT)|g' scripts/backups/systemd/zadar-backup.service | sudo tee /etc/systemd/system/zadar-backup.service >/dev/null
	@sudo cp scripts/backups/systemd/zadar-backup.timer /etc/systemd/system/zadar-backup.timer
	@sudo systemctl daemon-reload
	@sudo systemctl enable --now zadar-backup.timer
	@echo "Installed. Verify with: systemctl list-timers zadar-backup.timer"
```

- [ ] **Step 4: Verify unit syntax and target rendering**

Run:
```bash
systemd-analyze verify scripts/backups/systemd/zadar-backup.timer 2>&1 | grep -v "__PROJECT_ROOT__" || echo "TIMER OK"
make -n install-backup-timer
```
Expected: `make -n` prints the sed/cp/systemctl commands. The `systemd-analyze` line may be unavailable in this environment — if so, just confirm the `.timer` `[Timer]` section contains `OnCalendar=*-*-1/2 03:00:00` via `grep OnCalendar scripts/backups/systemd/zadar-backup.timer`.

- [ ] **Step 5: Commit**

```bash
git add scripts/backups/systemd Makefile
git commit -m "feat(backups): add systemd timer (every 2 days) and install-backup-timer target"
```

---

### Task 8: Documentation updates

**Files:**
- Modify: `README.deploy.md`
- Modify: `CLAUDE.md` (Docker Compose Environments table + backup commands section)

- [ ] **Step 1: Update `README.deploy.md`**

Replace every `docker-compose.vps.yml` reference with `docker-compose.prod.yml`. Add a "Backups" section after the deploy steps:

```markdown
## Backups (production)

Backups write timestamped files to `backups/prod/` (DB dump + uploads archive) and keep the most recent 15 of each.

Manual full backup:

```bash
make backup-prod-full
```

Restore the latest pair into the running prod stack:

```bash
make restore-prod
```

### Scheduled backups (every 2 days)

Install the systemd timer on the VPS (run from the deploy directory):

```bash
make install-backup-timer
systemctl list-timers zadar-backup.timer   # verify it is scheduled
```

Plain-cron alternative (instead of the timer):

```cron
# Every 2 days at 03:00 — adjust the path to your deploy directory
0 3 */2 * * cd /path/to/zadar-museum && ./scripts/backups/backup.sh >> /var/log/zadar-backup.log 2>&1
```

### SSL certificates

Certificates are issued by the certbot sidecar and auto-renewed (12 h loop); nginx reloads every 6 h to pick up renewed certs — no manual action needed. For a from-scratch re-issuance, temporarily swap nginx to `nginx/nginx.ssl-init.conf` (HTTP-only ACME bootstrap), run `certbot certonly --webroot -w /var/www/certbot -d ovdjejekosarkasve.com -d www.ovdjejekosarkasve.com`, then switch back to `nginx.prod.conf`.
```

- [ ] **Step 2: Update the Docker Compose table in `CLAUDE.md`**

In the "Docker Compose Environments" table, remove the `docker-compose.vps.yml` row and update the `docker-compose.prod.yml` row to read:

```markdown
| `docker-compose.prod.yml` | `.env.prod` | Production (VPS) — GHCR images, nginx + certbot SSL, Redis |
```

Also, in the backend/full-stack commands area, add a note documenting `make backup-prod-full`, `make restore-prod`, and `make install-backup-timer`.

- [ ] **Step 3: Verify no dangling `vps.yml` references remain anywhere**

Run:
```bash
grep -rn --exclude-dir=.git --exclude-dir=node_modules \
  -e "docker-compose.vps.yml" -e "nginx.vps.conf" . || echo "ALL CLEAN"
```
Expected: `ALL CLEAN` (the design spec under `docs/` legitimately *describes* the old files by name as history; if grep surfaces only the spec/plan docs, that is acceptable — fix any remaining references in README/CLAUDE/Makefile/compose).

- [ ] **Step 4: Commit**

```bash
git add README.deploy.md CLAUDE.md
git commit -m "docs: update deploy/backup/SSL docs for prod.yml consolidation"
```

---

## Final verification (after all tasks)

- [ ] `docker compose -f docker-compose.prod.yml --env-file .env.prod.example config >/dev/null && echo OK` → `OK`
- [ ] `git ls-files | grep -E "docker-compose.vps.yml|nginx/nginx.vps.conf"` → no output (files gone)
- [ ] `bash -n scripts/backups/backup.sh && bash -n scripts/backups/restore.sh && echo OK` → `OK`
- [ ] `make -n backup-prod-full restore-prod install-backup-timer` → prints commands, no errors
- [ ] `grep -rn --exclude-dir=.git --exclude-dir=docs -e "docker-compose.vps.yml" -e "nginx.vps.conf" .` → no output
```
