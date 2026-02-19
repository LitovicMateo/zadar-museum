#!/usr/bin/env bash
set -euo pipefail

# Simple script to create a pg_dump of the postgres service from a compose stack
# and save it to the project root as zadar_backup.sql by default.

COMPOSE_FILE="docker-compose.dev.yml"
ENV_FILE=".env.dev"
SERVICE="postgres"
DB_USER="strapi"
DB_NAME="strapi"
OUTPUT="$(pwd)/zadar_backup.sql"

usage(){
  cat <<EOF
Usage: $0 [--compose-file FILE] [--env-file FILE] [--service NAME] [--db-user USER] [--db-name NAME] [--output PATH]

Defaults:
  --compose-file docker-compose.dev.yml
  --env-file .env.dev
  --service postgres
  --db-user strapi
  --db-name strapi
  --output ./zadar_backup.sql
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --compose-file) COMPOSE_FILE="$2"; shift 2;;
    --env-file) ENV_FILE="$2"; shift 2;;
    --service) SERVICE="$2"; shift 2;;
    --db-user) DB_USER="$2"; shift 2;;
    --db-name) DB_NAME="$2"; shift 2;;
    --output) OUTPUT="$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 2;;
  esac
done

# detect compose command
if command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  COMPOSE_CMD="docker compose"
fi

# try to read password from env file if present
DB_PASSWORD=""
if [ -f "$ENV_FILE" ]; then
  # look for DATABASE_PASSWORD or POSTGRES_PASSWORD
  DB_PASSWORD=$(grep -E '^(DATABASE_PASSWORD|POSTGRES_PASSWORD)=' "$ENV_FILE" | head -n1 | sed -E 's/^[^=]+=//') || true
fi
# fallback to env var if present
if [ -z "$DB_PASSWORD" ] && [ -n "${DATABASE_PASSWORD:-}" ]; then
  DB_PASSWORD="$DATABASE_PASSWORD"
fi

echo "Using compose file: $COMPOSE_FILE (env: $ENV_FILE)"

# find container id
CONTAINER=$($COMPOSE_CMD -f "$COMPOSE_FILE" ps -q "$SERVICE" 2>/dev/null || true)
if [ -z "$CONTAINER" ]; then
  echo "No container found for service '$SERVICE' (is the stack running?)." >&2
  exit 1
fi

echo "Found container: $CONTAINER"

echo "Dumping database '$DB_NAME' as user '$DB_USER' to $OUTPUT"

if [ -n "$DB_PASSWORD" ]; then
  # use docker exec to run pg_dump inside the container and stream to host
  docker exec -i "$CONTAINER" sh -c "export PGPASSWORD='$DB_PASSWORD'; export PGCLIENTENCODING=UTF8; pg_dump -U '$DB_USER' -d '$DB_NAME'" > "$OUTPUT"
else
  docker exec -i "$CONTAINER" sh -c "export PGCLIENTENCODING=UTF8; pg_dump -U '$DB_USER' -d '$DB_NAME'" > "$OUTPUT"
fi

echo "Backup saved to: $OUTPUT"
