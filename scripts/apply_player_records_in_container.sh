#!/bin/sh
set -e

# Apply SQL files copied to /tmp/player-records inside the container
find /tmp/player-records -type f -name '*.sql' | sort | while read -r f; do
  echo "=== Applying $f ==="
  # Extract materialized view name in a POSIX-safe way: find the line containing
  # 'CREATE MATERIALIZED VIEW', remove the leading part up to 'view', strip
  # optional 'public.' prefix, and take the first token as the name.
  # Use filename as materialized view name (files are named after the MV), fallback
  # to parsing the SQL if needed.
  mvname=$(basename "$f" .sql)
  if [ -n "$mvname" ]; then
    echo "Dropping materialized view $mvname"
    psql -U strapi -d strapi -c "DROP MATERIALIZED VIEW IF EXISTS public.$mvname CASCADE;"
  fi
  psql -U strapi -d strapi -v ON_ERROR_STOP=1 -f "$f"
done

echo "All files applied." 
