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
