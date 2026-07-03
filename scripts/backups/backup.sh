#!/usr/bin/env bash
set -euo pipefail

# Create timestamped Postgres + Strapi uploads backups from a running compose
# stack and prune to a retention limit. Defaults target the production stack.

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"
PG_SERVICE="postgres"
BACKEND_SERVICE="backend"
DB_USER=""
DB_NAME=""
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

# Resolve DB user/name: CLI flags win, else read from the env file, else default to 'strapi'
if [ -z "$DB_USER" ] && [ -f "$ENV_FILE" ]; then
  DB_USER=$(grep -E '^(POSTGRES_USER|DATABASE_USERNAME)=' "$ENV_FILE" | head -n1 | sed -E 's/^[^=]+=//') || true
fi
if [ -z "$DB_NAME" ] && [ -f "$ENV_FILE" ]; then
  DB_NAME=$(grep -E '^(POSTGRES_DB|DATABASE_NAME)=' "$ENV_FILE" | head -n1 | sed -E 's/^[^=]+=//') || true
fi
DB_USER="${DB_USER:-strapi}"
DB_NAME="${DB_NAME:-strapi}"

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
