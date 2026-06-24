#!/usr/bin/env bash
# restore-dev-from-vps.sh
# ────────────────────────────────────────────────────────────────────
# Finds the LATEST backup files in backups/vps/, restores the postgres
# database and Strapi uploads into the running dev Docker stack, then
# restarts the backend container.
#
# Requirements:
#   - Dev stack must already be running (`make dev`)
#   - Backup dir must contain at least one *.sql and one *.tar.gz file
#
# Usage:
#   bash scripts/backups/restore-dev-from-vps.sh
# ────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Paths ────────────────────────────────────────────────────────────
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PROJECT_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
BACKUP_DIR="$PROJECT_ROOT/backups/vps"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.dev.yml"
ENV_FILE="$PROJECT_ROOT/.env.dev"

# ── Colours ──────────────────────────────────────────────────────────
RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[1;33m'
BLD='\033[1m'
RST='\033[0m'

info()  { echo -e "${BLD}[restore]${RST} $*"; }
ok()    { echo -e "${GRN}[restore]${RST} $*"; }
warn()  { echo -e "${YLW}[restore]${RST} $*" >&2; }
die()   { echo -e "${RED}[restore] ERROR:${RST} $*" >&2; exit 1; }

# ── Sanity checks ────────────────────────────────────────────────────
[[ -d "$BACKUP_DIR" ]] || die "Backup directory not found: $BACKUP_DIR"

command -v docker >/dev/null 2>&1 || die "'docker' not found in PATH"

# ── Discover latest backup files ─────────────────────────────────────
SQL_FILE=$(ls -1 "$BACKUP_DIR"/*.sql 2>/dev/null | sort | tail -1 || true)
UPLOADS_FILE=$(ls -1 "$BACKUP_DIR"/*.tar.gz 2>/dev/null | sort | tail -1 || true)

[[ -n "$SQL_FILE" ]]     || die "No *.sql file found in $BACKUP_DIR"
[[ -n "$UPLOADS_FILE" ]] || die "No *.tar.gz file found in $BACKUP_DIR"

info "Latest DB dump     : $(basename "$SQL_FILE")"
info "Latest uploads archive: $(basename "$UPLOADS_FILE")"
echo

# Validate archive integrity before proceeding
info "Validating uploads archive integrity..."
if ! gzip -t "$UPLOADS_FILE" 2>/dev/null; then
  die "Uploads archive is corrupt or incomplete: $(basename "$UPLOADS_FILE")\n  Re-download it from the VPS and retry."
fi
ok "Archive is valid"
echo

# ── Verify dev stack is running ───────────────────────────────────────
PG_CONTAINER=$(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps -q postgres 2>/dev/null || true)

if [[ -z "$PG_CONTAINER" ]]; then
  die "No postgres container found. Start the dev stack first:\n  make dev"
fi

BACKEND_CONTAINER=$(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps -q backend 2>/dev/null || true)

if [[ -z "$BACKEND_CONTAINER" ]]; then
  die "No backend container found. Start the dev stack first:\n  make dev"
fi

info "Postgres container : $PG_CONTAINER"
info "Backend container  : $BACKEND_CONTAINER"
echo

# ── Wait for postgres to be ready ────────────────────────────────────
info "Waiting for postgres to accept connections..."
MAX_WAIT=30
WAITED=0
until docker exec "$PG_CONTAINER" pg_isready -U strapi -d postgres -q 2>/dev/null; do
  sleep 1
  WAITED=$((WAITED + 1))
  if [[ $WAITED -ge $MAX_WAIT ]]; then
    die "Postgres did not become ready within ${MAX_WAIT}s"
  fi
done
ok "Postgres is ready (waited ${WAITED}s)"
echo

# ── Step 1: Restore database ─────────────────────────────────────────
info "─── Step 1/2: Restoring database ───────────────────────────────"

SQL_BASENAME=$(basename "$SQL_FILE")
TMP_DEST="/tmp/$SQL_BASENAME"

info "Copying dump into container..."
docker cp "$SQL_FILE" "$PG_CONTAINER:$TMP_DEST"

info "Terminating active connections to 'strapi' database..."
docker exec "$PG_CONTAINER" \
  psql -U strapi -d postgres \
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'strapi' AND pid <> pg_backend_pid();" \
  > /dev/null

info "Dropping existing 'strapi' database..."
docker exec "$PG_CONTAINER" \
  psql -U strapi -d postgres \
  -c "DROP DATABASE IF EXISTS strapi;"

info "Recreating 'strapi' database..."
docker exec "$PG_CONTAINER" \
  psql -U strapi -d postgres \
  -c "CREATE DATABASE strapi WITH OWNER strapi ENCODING 'UTF8';"

info "Ensuring role 'strapi_prod' exists..."
ROLE_SQL="DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'strapi_prod') THEN CREATE ROLE strapi_prod; END IF; END \$\$;"
docker exec "$PG_CONTAINER" psql -U strapi -d postgres -c "$ROLE_SQL" \
  || warn "Could not ensure strapi_prod role — you may need to create it manually"

info "Importing dump (this may take a minute)..."
docker exec -e PGCLIENTENCODING=UTF8 "$PG_CONTAINER" \
  psql -U strapi -d strapi -f "$TMP_DEST"

info "Cleaning up dump from container..."
docker exec "$PG_CONTAINER" rm -f "$TMP_DEST"

ok "Database restored from: $(basename "$SQL_FILE")"
echo

# ── Step 2: Restore Strapi uploads ───────────────────────────────────
info "─── Step 2/2: Restoring Strapi uploads ────────────────────────"

# Get the named volume backing /app/public/uploads from the backend container
UPLOADS_VOLUME=$(docker inspect "$BACKEND_CONTAINER" \
  --format '{{range .Mounts}}{{if eq .Destination "/app/public/uploads"}}{{.Name}}{{end}}{{end}}')

if [[ -z "$UPLOADS_VOLUME" ]]; then
  die "Could not find a named Docker volume mounted at /app/public/uploads in the backend container.\nIs the dev stack running with docker-compose.dev.yml?"
fi

info "Uploads volume: $UPLOADS_VOLUME"

# Auto-detect strip-components: if the first path component inside the archive
# looks like a directory (no extension), use --strip-components=1
FIRST_PATH=$(tar tzf "$UPLOADS_FILE" 2>/dev/null | head -1 || true)
FIRST_COMPONENT=$(echo "$FIRST_PATH" | cut -d'/' -f1)
if [[ -n "$FIRST_COMPONENT" && "$FIRST_COMPONENT" != *.* && "$FIRST_PATH" == */* ]]; then
  STRIP=1
else
  STRIP=0
fi
info "Archive strip-components: $STRIP  (first path: $FIRST_PATH)"

UPLOADS_BASENAME=$(basename "$UPLOADS_FILE")

info "Clearing existing uploads in volume..."
docker exec "$BACKEND_CONTAINER" sh -c "rm -rf /app/public/uploads/* /app/public/uploads/.[!.]* 2>/dev/null || true"

info "Copying uploads archive into backend container (this may take a moment for large archives)..."
docker cp "$UPLOADS_FILE" "$BACKEND_CONTAINER:/tmp/uploads-restore.tar.gz"

info "Extracting uploads archive..."
docker exec "$BACKEND_CONTAINER" sh -c "tar xzf /tmp/uploads-restore.tar.gz -C /app/public/uploads --strip-components=${STRIP}"

info "Cleaning up archive from container..."
docker exec "$BACKEND_CONTAINER" rm -f /tmp/uploads-restore.tar.gz

ok "Uploads restored from: $(basename "$UPLOADS_FILE")"
echo

# ── Step 3: Restart backend ───────────────────────────────────────────
info "─── Restarting backend container ───────────────────────────────"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart backend
ok "Backend restarted"
echo

# ── Summary ──────────────────────────────────────────────────────────
echo -e "${GRN}${BLD}─── Restore complete ────────────────────────────────────────${RST}"
echo -e "  DB dump   : $(basename "$SQL_FILE")"
echo -e "  Uploads   : $(basename "$UPLOADS_FILE")"
echo -e "  Volume    : $UPLOADS_VOLUME"
echo -e "  Backend   : restarted"
echo
echo -e "Strapi should be available at ${BLD}http://localhost:1337/admin${RST} shortly."
