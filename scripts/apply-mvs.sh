#!/usr/bin/env bash
set -euo pipefail

# Apply SQL materialized views and related SQL files into Postgres container
# Usage: ./scripts/apply-mvs.sh [--compose-file FILE] [--dry-run] [--force] [--backup]

COMPOSE_FILE="docker-compose.dev.yml"
ENV_FILE=".env.dev"
DRY_RUN=0
FORCE=0
BACKUP=0
LOG_DIR="logs"
LOG_FILE="${LOG_DIR}/apply-mvs-$(date +%Y%m%d_%H%M%S).log"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-postgres}"
RETRIES=10
SLEEP=2

usage(){
  echo "Usage: $0 [--compose-file FILE] [--env-file FILE] [--dry-run] [--force] [--backup]"
  exit 1
}

while [[ ${#} -gt 0 ]]; do
  case "$1" in
    --compose-file)
      COMPOSE_FILE="$2"; shift 2;;
    --env-file)
      ENV_FILE="$2"; shift 2;;
    --dry-run)
      DRY_RUN=1; shift;;
    --force)
      FORCE=1; shift;;
    --backup)
      BACKUP=1; shift;;
    -h|--help)
      usage;;
    *)
      echo "Unknown arg: $1"; usage;;
  esac
done

# Try to read database password and DB/user names from the provided env file (if present)
DB_PASSWORD=""
if [[ -f "${ENV_FILE}" ]]; then
  DB_PASSWORD=$(grep -E '^(DATABASE_PASSWORD|POSTGRES_PASSWORD)=' "${ENV_FILE}" | head -n1 | sed -E 's/^[^=]+=//' ) || true
  # prefer Postgres vars, fall back to generic DATABASE_* names
  POSTGRES_USER_FROM_FILE=$(grep -E '^(POSTGRES_USER|DATABASE_USERNAME)=' "${ENV_FILE}" | head -n1 | sed -E 's/^[^=]+=//' ) || true
  POSTGRES_DB_FROM_FILE=$(grep -E '^(POSTGRES_DB|DATABASE_NAME)=' "${ENV_FILE}" | head -n1 | sed -E 's/^[^=]+=//' ) || true
fi

# fallback to environment variables when provided to the shell
if [[ -z "${DB_PASSWORD}" ]] && [[ -n "${DATABASE_PASSWORD:-}" ]]; then
  DB_PASSWORD="${DATABASE_PASSWORD}"
fi
if [[ -n "${DB_PASSWORD}" ]]; then
  export PGPASSWORD="${DB_PASSWORD}"
fi

# If env file provided DB user / name, prefer env-file values (override defaults and shell env)
if [[ -n "${POSTGRES_USER_FROM_FILE:-}" ]]; then
  POSTGRES_USER="${POSTGRES_USER_FROM_FILE}"
fi
if [[ -n "${POSTGRES_DB_FROM_FILE:-}" ]]; then
  POSTGRES_DB="${POSTGRES_DB_FROM_FILE}"
fi

# Log selected DB user/name (safe to log non-sensitive info)
echo "Using Postgres user='${POSTGRES_USER}', db='${POSTGRES_DB}' (env-file: ${ENV_FILE:-none})" | tee -a "${LOG_FILE}"

mkdir -p "${LOG_DIR}"

detect_compose_cmd(){
  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
  elif docker compose version >/dev/null 2>&1; then
    echo "docker compose"
  else
    echo "";
  fi
}

COMPOSE_CMD=$(detect_compose_cmd)
if [[ -z "${COMPOSE_CMD}" ]]; then
  echo "Neither 'docker-compose' nor 'docker compose' found in PATH" | tee -a "${LOG_FILE}" >&2
  exit 1
fi

check_compose_file(){
  if [[ ! -f "${COMPOSE_FILE}" ]]; then
    echo "Compose file ${COMPOSE_FILE} not found" | tee -a "${LOG_FILE}" >&2
    exit 1
  fi
}

check_container_running(){
  # get container id for service 'postgres'
  container_id=$(${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps -q postgres 2>/dev/null || true)
  if [[ -z "$container_id" ]]; then
    echo "Postgres service 'postgres' is not running (compose file: ${COMPOSE_FILE})." | tee -a "${LOG_FILE}" >&2
    exit 1
  fi
}

wait_for_pg(){
  echo "Waiting for Postgres to be ready..." | tee -a "${LOG_FILE}"
  n=0
  while ! ${COMPOSE_CMD} -f "${COMPOSE_FILE}" exec -T postgres pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; do
    n=$((n+1))
    if [[ $n -ge ${RETRIES} ]]; then
      echo "pg_isready timed out" | tee -a "${LOG_FILE}" >&2
      exit 1
    fi
    sleep ${SLEEP}
  done
  echo "Postgres ready" | tee -a "${LOG_FILE}"
}

do_backup(){
  if [[ ${BACKUP} -eq 1 ]]; then
    echo "Creating backup (compressed) to ${LOG_DIR}/backup-$(date +%Y%m%d_%H%M%S).sql.gz" | tee -a "${LOG_FILE}"
    ${COMPOSE_CMD} -f "${COMPOSE_FILE}" exec -T postgres pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" | gzip > "${LOG_DIR}/backup-$(date +%Y%m%d_%H%M%S).sql.gz"
    echo "Backup complete" | tee -a "${LOG_FILE}"
  fi
}

confirm_destructive(){
  if [[ ${FORCE} -eq 1 ]]; then
    return
  fi
  echo "This will DROP and RECREATE the public schema in database ${POSTGRES_DB} inside the postgres container. This is destructive." >&2
  read -p "Type 'yes' to continue: " ans
  if [[ "$ans" != "yes" ]]; then
    echo "Aborted by user." | tee -a "${LOG_FILE}"
    exit 1
  fi
}

run_drop_snippet(){
  # Only drop materialized views and ordinary views. Do not drop base tables or sequences.
  cat <<'SQL' | ${COMPOSE_CMD} -f "${COMPOSE_FILE}" exec -T postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1 -f -
DO $$
DECLARE r RECORD;
BEGIN
  -- drop materialized views in public
  FOR r IN SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP MATERIALIZED VIEW IF EXISTS %I.%I CASCADE', r.schemaname, r.matviewname);
  END LOOP;

  -- drop regular views in public
  FOR r IN SELECT table_schema, table_name FROM information_schema.views WHERE table_schema = 'public' LOOP
    EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', r.table_schema, r.table_name);
  END LOOP;
END$$;
SQL
}

apply_sql_files(){
  layers=("Layer 1" "Layer 2" "Layer 3")
  for layer in "${layers[@]}"; do
    dir="sql/${layer}"
    if [[ ! -d "$dir" ]]; then
      echo "Skipping missing directory: $dir" | tee -a "${LOG_FILE}"
      continue
    fi

    echo "Applying files in ${dir}..." | tee -a "${LOG_FILE}"

    # Use null-delimited safe handling for filenames with spaces/unusual chars
    # sort -z ensures deterministic order
    # Special-case Layer 1 ordering: ensure team_boxscore is applied before coach/player/schedule
    if [[ "$layer" == "Layer 1" ]]; then
      manual_order=("team_boxscore.sql" "player_boxscore..sql" "coach_boxscore.sql" "schedule.sql")
      for name in "${manual_order[@]}"; do
        file="$dir/$name"
        if [[ -f "$file" ]]; then
          echo "-- ${file}" | tee -a "${LOG_FILE}"
          if [[ ${DRY_RUN} -eq 1 ]]; then
            echo "DRY-RUN: would apply: ${file}" | tee -a "${LOG_FILE}"
          else
            if ! cat "${file}" | ${COMPOSE_CMD} -f "${COMPOSE_FILE}" exec -T postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1 -f - >>"${LOG_FILE}" 2>&1; then
              echo "ERROR applying ${file}. See ${LOG_FILE}" | tee -a "${LOG_FILE}" >&2
              exit 1
            fi
            echo "Applied: ${file}" | tee -a "${LOG_FILE}"
          fi
        fi
      done

      # Apply any other files in Layer 1 (deterministic order)
      find "$dir" -type f -name '*.sql' -print0 2>/dev/null | sort -z | \
        while IFS= read -r -d '' file; do
          base=$(basename "$file")
          skip=0
          for s in "${manual_order[@]}"; do [[ "$base" == "$s" ]] && skip=1 && break; done
          if [[ $skip -eq 1 ]]; then continue; fi
          echo "-- ${file}" | tee -a "${LOG_FILE}"
          if [[ ${DRY_RUN} -eq 1 ]]; then
            echo "DRY-RUN: would apply: ${file}" | tee -a "${LOG_FILE}"
            continue
          fi
          if ! cat "${file}" | ${COMPOSE_CMD} -f "${COMPOSE_FILE}" exec -T postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1 -f - >>"${LOG_FILE}" 2>&1; then
            echo "ERROR applying ${file}. See ${LOG_FILE}" | tee -a "${LOG_FILE}" >&2
            exit 1
          fi
          echo "Applied: ${file}" | tee -a "${LOG_FILE}"
        done

      continue
    fi

    find "$dir" -type f -name '*.sql' -print0 2>/dev/null | sort -z | \
      while IFS= read -r -d '' file; do
        echo "-- ${file}" | tee -a "${LOG_FILE}"
        if [[ ${DRY_RUN} -eq 1 ]]; then
          echo "DRY-RUN: would apply: ${file}" | tee -a "${LOG_FILE}"
          continue
        fi

        # Stream file into psql inside container
        if ! cat "${file}" | ${COMPOSE_CMD} -f "${COMPOSE_FILE}" exec -T postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -v ON_ERROR_STOP=1 -f - >>"${LOG_FILE}" 2>&1; then
          echo "ERROR applying ${file}. See ${LOG_FILE}" | tee -a "${LOG_FILE}" >&2
          exit 1
        fi
        echo "Applied: ${file}" | tee -a "${LOG_FILE}"
      done
  done
}

main(){
  check_compose_file
  check_container_running
  wait_for_pg
  do_backup
  confirm_destructive

  if [[ ${DRY_RUN} -eq 1 ]]; then
    echo "DRY RUN: listing files that would be applied:" | tee -a "${LOG_FILE}"
    for layer in "Layer 1" "Layer 2" "Layer 3"; do
      find "sql/${layer}" -type f -name '*.sql' -print | sed -e 's/^/  /' || true
    done
    exit 0
  fi

  echo "Running drop/recreate of public schema..." | tee -a "${LOG_FILE}"
  run_drop_snippet
  echo "Schema reset complete" | tee -a "${LOG_FILE}"

  apply_sql_files

  echo "All done. Log: ${LOG_FILE}" | tee -a "${LOG_FILE}"
}

main
