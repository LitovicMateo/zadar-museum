#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 [path-to-sql-dump] [docker-compose-file] [service-name]

If no dump path is provided, the script will use the project-root file:
  <project-root>/zadar-backup.sql

Defaults:
  docker-compose-file: docker-compose.staging.yml
  service-name: postgres

Example:
  $0
  $0 /path/to/zadar-backup.sql docker-compose.staging.yml postgres
EOF
  exit 1
}

# Default dump path: project root / zadar-backup.sql (script lives in scripts/)
if [[ -n ${1:-} ]]; then
  DUMP_PATH=$1
else
  SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
  DUMP_PATH="$SCRIPT_DIR/../zadar-backup.sql"
fi
COMPOSE_FILE=${2:-docker-compose.staging.yml}
SERVICE=${3:-postgres}

if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found in PATH" >&2
  exit 2
fi

if [[ ! -f "$DUMP_PATH" ]]; then
  echo "Dump file not found: $DUMP_PATH" >&2
  exit 3
fi

DUMP_ABS=$(readlink -f "$DUMP_PATH")
CONTAINER_ID=$(docker compose -f "$COMPOSE_FILE" ps -q "$SERVICE" || true)

if [[ -z "$CONTAINER_ID" ]]; then
  echo "No running container found for service '$SERVICE' in $COMPOSE_FILE" >&2
  echo "Start the stack first: docker compose -f $COMPOSE_FILE up -d" >&2
  exit 4
fi

TMP_DEST="/tmp/$(basename "$DUMP_ABS")"

echo "Copying $DUMP_ABS -> $CONTAINER_ID:$TMP_DEST"
docker cp "$DUMP_ABS" "$CONTAINER_ID:$TMP_DEST"

echo "Verifying file inside container..."
docker compose -f "$COMPOSE_FILE" exec -T "$SERVICE" sh -lc "ls -lh $TMP_DEST || echo 'missing'"

echo "Ensure role 'strapi_prod' exists (safe no-op if already present)"
CREATE_ROLE_SQL="DO \\\$\\nBEGIN\n  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'strapi_prod') THEN\n    CREATE ROLE strapi_prod;\n  END IF;\nEND\n\\$\\;"

# Try as 'postgres' then fall back to 'strapi'
if docker compose -f "$COMPOSE_FILE" exec -T "$SERVICE" psql -U postgres -c "$CREATE_ROLE_SQL" 2>/dev/null; then
  echo "Role ensured via user 'postgres'."
elif docker compose -f "$COMPOSE_FILE" exec -T "$SERVICE" psql -U strapi -c "$CREATE_ROLE_SQL" 2>/dev/null; then
  echo "Role ensured via user 'strapi'."
else
  echo "Warning: could not run role-creation as 'postgres' or 'strapi'. You may need to create role 'strapi_prod' manually inside the container." >&2
fi

echo "Importing dump into 'strapi' database as user 'strapi' with PGCLIENTENCODING=UTF8"
docker compose -f "$COMPOSE_FILE" exec -e PGCLIENTENCODING=UTF8 -T "$SERVICE" psql -U strapi -d strapi -f "$TMP_DEST"

echo "Import completed. You can remove the dump from the container with:" \
  "docker compose -f $COMPOSE_FILE exec -T $SERVICE sh -lc 'rm -f $TMP_DEST'"

exit 0
