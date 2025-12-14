# zadar-basketball-museum

This repository contains the Zadar Basketball Museum application (frontend and backend) and deployment scripts used on the VPS.

This README collects common operational commands and safe procedures for working with the production stack and for copying production data to your local environment for testing.

---

## Table of contents

- [Stop and remove containers](#stop-and-remove-containers)
- [Restart Docker](#restart-docker)
- [Clean up images](#clean-up-images)
- [Recreate services (VPS)](#recreate-services-vps)
- [Read materialized views (Postgres)](#read-materialized-views-postgres)
- [Recreate images (selective)](#recreate-images-selective)
- [Execute materialized views script (inside node)](#execute-materialized-views-script-inside-node)
- [Refresh player views](#refresh-player-views)
- [Clear materialized views in DB](#clear-materialized-views-in-db)
- [Pull live database to local machine](#pull-live-database-to-local-machine)
- [Import production Postgres locally (preserve UTF-8)](#import-production-postgres-locally-preserve-utf-8)

---

## Stop and remove containers

Stop and remove the specific containers created by the production stack. Non-running or missing containers are ignored.

```bash
docker rm -f nginx_prod react_prod strapi_prod certbot postgres_prod 2>/dev/null || true
```

## Restart Docker

If you see odd Docker metadata errors, restart the daemon on the VPS:

```bash
systemctl restart docker
sleep 3
```

## Clean up images

Remove dangling images to free disk space (this is non-destructive to volumes):

```bash
docker image prune -a -f
```

## Recreate services (VPS)

Pull fresh images from the registry and recreate the stack on the VPS:

```bash
docker-compose -f docker-compose.vps.yml pull
docker-compose -f docker-compose.vps.yml up -d --force-recreate
```

## Read materialized views (Postgres)

List all materialized views in Postgres (excludes system schemas):

```bash
docker-compose -f docker-compose.vps.yml exec -T postgres \
  psql -U "strapi_prod" -d "strapi_prod" -c \
  "SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY schemaname, matviewname;"
```

## Recreate images (selective)

When you need to pull and recreate only specific services (frontend/backend) without touching the whole stack:

```bash
# Pull images
docker-compose -f docker-compose.vps.yml pull frontend backend

# Recreate containers (no dependencies)
docker-compose -f docker-compose.vps.yml up -d --no-deps --force-recreate frontend backend
```

## Execute materialized views script (inside a node container)

Use this helper to run Node scripts that need network access to the Postgres container on the compose network.

```bash
POSTGRES_CTR=$(docker-compose -f docker-compose.vps.yml ps -q postgres)
NET=$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}' "$POSTGRES_CTR" | awk '{print $1}')
echo "postgres container: $POSTGRES_CTR"
echo "compose network: $NET"

docker run --rm \
  -v "$(pwd)":/app \
  -w /app/backend \
  --network "$NET" \
  node:20 bash -lc "npm ci --production && \
    export DATABASE_HOST=postgres && \
    export DATABASE_PORT=5432 && \
    export DATABASE_USERNAME=strapi_prod && \
    export DATABASE_PASSWORD='STRONG_PASSWORD_HERE' && \
    export DATABASE_NAME=strapi_prod && \
    node ./scripts/apply-mvs.js"
```

Replace `STRONG_PASSWORD_HERE` with the real password when running interactively.

## Refresh player's views

Update local repo and run the refresh script:

```bash
cd ~/zadar-museum
git pull origin main
./refresh_player_views.sh
```

## Clear materialized views in DB

If you need to drop all MVs in the `public` schema inside the Postgres container:

```sql
-- Connect to the postgres container first (example container name shown)
docker exec -it postgres_prod psql -U strapi_prod -d strapi_prod

-- Then run:
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT matviewname FROM pg_matviews WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP MATERIALIZED VIEW IF EXISTS public.' || quote_ident(r.matviewname) || ' CASCADE';
        RAISE NOTICE 'Dropped: %', r.matviewname;
    END LOOP;
END $$;
```

## Pull live database to local machine

Create a dump on the VPS and copy it to your workstation. This is the simplest approach but be careful with file encodings when importing on Windows/PowerShell.

On the VPS:

```bash
docker-compose -f docker-compose.vps.yml exec -T postgres \
  pg_dump -U strapi_prod -d strapi_prod --clean --if-exists > zadar_backup.sql
```

On your local machine (example `scp`):

```bash
scp root@91.98.47.143:/root/zadar-museum/zadar_backup.sql D:\workingDir\zadar\
```

Once the file is local, avoid using plain text pipes in PowerShell (they can change encoding). See the next section for safe import methods.

## Import production Postgres locally (preserve UTF-8)

When you import a production dump on Windows/PowerShell, special characters may be corrupted if the file is reinterpreted with the wrong encoding. Use one of these binary-safe methods.

1. Copy the dump into the Postgres container and import there (PowerShell)

```powershell
# copy dump into container (use absolute Windows path)
docker cp "D:\\workingDir\\zadar\\zadar_backup.sql" postgres_dev:/tmp/zadar_backup.sql

# verify the file exists in the container
docker exec postgres_dev sh -lc "ls -lh /tmp/zadar_backup.sql || echo 'missing'"

# import while forcing UTF-8 client encoding
docker exec -e PGCLIENTENCODING=UTF8 postgres_dev sh -c "psql -U strapi -d strapi -f /tmp/zadar_backup.sql"
```

2. Stream raw bytes into the container (no intermediate copy)

```powershell
Get-Content .\zadar_backup.sql -Encoding Byte -ReadCount 0 | docker exec -i -e PGCLIENTENCODING=UTF8 postgres_dev psql -U strapi -d strapi
```

3. If you must re-dump on the VPS, ensure explicit UTF-8 encoding

```bash
docker-compose -f docker-compose.vps.yml exec -T postgres \
  pg_dump -U strapi_prod -d strapi_prod --encoding=UTF8 --clean --if-exists > zadar_backup.sql
```

Quick checks after importing:

```powershell
docker exec postgres_dev psql -U strapi -d strapi -c "SHOW server_encoding; SHOW client_encoding;"
docker exec postgres_dev psql -U strapi -d strapi -c "SELECT name FROM teams WHERE name ILIKE '%Sušak%' LIMIT 5;"
```

Notes

- Use `PGCLIENTENCODING=UTF8` so `psql` interprets incoming bytes as UTF-8.
- Avoid piping text through PowerShell without `-Encoding Byte` (PowerShell may transcode newlines/encodings).
- If your local DB cluster is not UTF-8, create a new database with UTF-8 encoding and import into it, or reinitialize your local Postgres if you do not need existing local data.

---

If you want, I can also add a short troubleshooting checklist for common import errors (role missing, encoding errors, permission issues). Would you like that added to the README as a small FAQ section?

# zadar-basketball-museum

cd /root/zadar-museum

# stop and remove specific containers created by the stack

docker rm -f nginx_prod react_prod strapi_prod certbot postgres_prod 2>/dev/null || true

# restart docker engine (if you saw odd metadata errors)

systemctl restart docker
sleep 3

# optionally remove dangling images to free space (non-destructive to volumes)

docker image prune -a -f

# recreate services (pull first if you want freshest images)

docker-compose -f docker-compose.vps.yml pull
docker-compose -f docker-compose.vps.yml up -d --force-recreate

## Read all Materialized Views in Postgres VSP

```
docker-compose -f docker-compose.vps.yml exec -T postgres \
  psql -U "strapi_prod" -d "strapi_prod" -c \
  "SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY schemaname, matviewname;"

```

## Recreate images

```
# check images
docker ps -a

# remove images
docker rm -f <container_id>

# pull new images
docker-compose -f docker-compose.vps.yml pull frontend
docker-compose -f docker-compose.vps.yml up -d --no-deps --force-recreate frontend

docker-compose -f docker-compose.vps.yml pull backend
docker-compose -f docker-compose.vps.yml up -d --no-deps --force-recreate backend

docker-compose -f docker-compose.vps.yml pull frontend backend
docker-compose -f docker-compose.vps.yml up -d --no-deps --force-recreate frontend backend


# recreate images

```

91.98.47.143

## Execute MVs

```
POSTGRES_CTR=$(docker-compose -f docker-compose.vps.yml ps -q postgres)
NET=$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}' "$POSTGRES_CTR" | awk '{print $1}')
echo "postgres container: $POSTGRES_CTR"
echo "compose network: $NET"

docker run --rm \
  -v "$(pwd)":/app \
  -w /app/backend \
  --network "$NET" \
  node:20 bash -lc "npm ci --production && \
    export DATABASE_HOST=postgres && \
    export DATABASE_PORT=5432 && \
    export DATABASE_USERNAME=strapi_prod && \
    export DATABASE_PASSWORD='STRONG_PASSWORD_HERE' && \
    export DATABASE_NAME=strapi_prod && \
    node ./scripts/apply-mvs.js"

```

## Refresh player's views

```
cd ~/zadar-museum
git pull origin main
./refresh_player_views.sh
```

## Clear all MVs in DB

# Connect to the postgres container

```
docker exec -it  postgres_prod psql -U strapi_prod -d strapi_prod

-- Drop all materialized views in the public schema
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT matviewname FROM pg_matviews WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP MATERIALIZED VIEW IF EXISTS public.' || quote_ident(r.matviewname) || ' CASCADE';
        RAISE NOTICE 'Dropped: %', r.matviewname;
    END LOOP;
END $$;
```

## Pull live database to local machine

```
# on VPS

docker-compose -f docker-compose.vps.yml exec -T postgres \
  pg_dump -U strapi_prod -d strapi_prod --clean --if-exists > zadar_backup.sql
```

```
# on local machine
scp root@91.98.47.143:/root/zadar-museum/zadar_backup.sql d:\workingDir\zadar\

Get-Content d:\workingDir\zadar\zadar_backup.sql | docker-compose exec -T postgres psql -U strapi -d strapi
```

## Import production Postgres locally (preserve UTF-8)

If you want a local copy of the production database for testing, follow these steps. The important part is to avoid any shell or PowerShell text re-encoding during transfer/import so special characters (e.g. `š`, `ć`) remain intact.

- On the VPS: create a dump encoded as UTF-8

```bash
cd /root/zadar-museum
docker-compose -f docker-compose.vps.yml exec -T postgres \
  pg_dump -U strapi_prod -d strapi_prod --encoding=UTF8 --clean --if-exists > zadar_backup.sql
```

- Transfer the file to your machine (example using `scp`)

```powershell
scp root@91.98.47.143:/root/zadar-museum/zadar_backup.sql D:\workingDir\zadar\
```

- Recommended import (PowerShell) — copy the file into the Postgres container and import there (binary-safe):

```powershell
# copy dump into container (use absolute Windows path)
docker cp "D:\\workingDir\\zadar\\zadar_backup.sql" postgres_dev:/tmp/zadar_backup.sql

# verify the file exists in the container
docker exec postgres_dev sh -lc "ls -lh /tmp/zadar_backup.sql || echo 'missing'"

# import while forcing UTF-8 client encoding
docker exec -e PGCLIENTENCODING=UTF8 postgres_dev sh -c "psql -U strapi -d strapi -f /tmp/zadar_backup.sql"
```

- Alternative (stream raw bytes into the container; avoids `docker cp`):

```powershell
Get-Content .\zadar_backup.sql -Encoding Byte -ReadCount 0 | docker exec -i -e PGCLIENTENCODING=UTF8 postgres_dev psql -U strapi -d strapi
```

- Quick checks after import:

```powershell
# check encodings
docker exec postgres_dev psql -U strapi -d strapi -c "SHOW server_encoding; SHOW client_encoding;"

# verify a sample name contains correct characters
docker exec postgres_dev psql -U strapi -d strapi -c "SELECT name FROM teams WHERE name ILIKE '%Sušak%' LIMIT 5;"
```

Notes:

- Use `PGCLIENTENCODING=UTF8` so `psql` interprets incoming bytes as UTF-8.
- Avoid piping text through PowerShell without `-Encoding Byte` (PowerShell may transcode newlines/encodings).
- If your local DB is not UTF-8, create a new database with UTF-8 encoding (or reinitialize your local Postgres) and import into that.
