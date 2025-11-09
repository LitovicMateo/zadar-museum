# Deployment guide (VPS + Docker)

This document explains how to deploy the repo to a VPS that uses Docker Compose, and how to run the materialized-view migrations that live in the `sql/` folder using the same `apply-mvs.js` script you used locally.

Prerequisites (on the VPS)

- Docker & Docker Compose installed
- Git (or other way to fetch repo) and SSH access to VPS
- Access to the Postgres instance used by the app (usually the `postgres` service in your compose file)
- A DB user with enough privileges to CREATE materialized views

Summary

- Pull the repo to the VPS (git clone / git pull).
- Take a DB backup (using `pg_dump` inside the Postgres container).
- Run the migration runner (`backend/scripts/apply-mvs.js`) from a temporary Node container attached to your Docker Compose network (so it can reach the Postgres service by its service name).
- Start or restart the backend service.

Example commands (assume you are in the repo root on the VPS)

1. Pull latest code

```bash
cd /path/to/deploy/directory
git pull origin main
```

2. Backup the DB (recommended)

# If your Postgres is a container in `docker-compose.vps.yml` and the service is named `postgres`:

docker compose -f docker-compose.vps.yml exec -T postgres pg_dump -U $DB_USER -Fc -f /tmp/pre_migration_backup.dump $DB_NAME

If you don't have PGPASSWORD env exported, docker will prompt for password. Copy the backup off the VPS or keep it in `/tmp` temporarily.

3. Identify the Docker Compose network name (so a temporary container can reach the DB service)

```bash
# List networks and look for one that matches your project (common suffix: _default)
docker network ls

# Or inspect compose to see networks in use
docker compose -f docker-compose.vps.yml ps
```

You'll need that network name in step 4. If your project uses default compose naming, the network is often `<foldername>_default`.

4. Run the migration runner using a temporary Node container (doesn't require Node installed on host)

Replace `<compose_network_name>` with the network you found, and replace DB envs with the ones your VPS uses. If Postgres service name in the compose file is `postgres`, you can use `DATABASE_HOST=postgres` because containers on the same network can reach each other by service name.

```bash
docker run --rm \
  -v "$(pwd)":/app \
  -w /app/backend \
  --network <compose_network_name> \
  node:20 bash -lc "npm ci --production && \
    export DATABASE_HOST=postgres && \
    export DATABASE_PORT=5432 && \
    export DATABASE_USERNAME=postgres && \
    export DATABASE_PASSWORD='your_db_password' && \
    export DATABASE_NAME=postgres && \
    node ./scripts/apply-mvs.js"
```

Notes:

- If your Postgres is external (managed service) configure `DATABASE_HOST` accordingly (host name or IP of DB).
- The runner inspects `sql/` recursively and applies files in deterministic order; it also retries deferred files to handle dependencies.

5. Restart backend service

After the runner completes successfully, start or restart your backend service so it picks up any code changes:

```bash
docker compose -f docker-compose.vps.yml pull
docker compose -f docker-compose.vps.yml up -d --remove-orphans --build backend
# or restart only backend
docker compose -f docker-compose.vps.yml restart backend
```

6. Verify

- Check Strapi admin/UI and a couple of endpoints.
- Inspect matviews: connect with `psql` or `pgAdmin` and run:

```sql
SELECT matviewname FROM pg_matviews WHERE schemaname='public' ORDER BY matviewname;
SELECT COUNT(*) FROM public.team_boxscore;
```

Scheduling refreshes (twice a week)

Because your data updates only occasionally, schedule refreshes (e.g. Tue & Fri) instead of refreshing during deploy. Two options:

- pg_cron (preferred) — install `pg_cron` extension and schedule server-side jobs to run REFRESH commands. This is robust and runs inside Postgres.
- Host cron — create a shell script that runs `psql` or uses a Docker container to execute REFRESH statements and schedule it with `crontab` or `systemd` timer.

Example host cron approach (script at `/opt/zadar/scripts/refresh-mvs.sh`):

```bash
#!/usr/bin/env bash
export PGPASSWORD='your_db_password'
PSQL="psql -h localhost -U postgres -d postgres -q -v ON_ERROR_STOP=1 -X"

# Refresh a small group at a time to avoid load spikes
${PSQL} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY public.team_boxscore;"
${PSQL} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY public.player_boxscore;"
# add more as needed or loop through a file with names
```

Add a cron entry (edit crontab -e):

```cron
# Run at 03:00 on Tue and Fri
0 3 * * Tue,Fri /opt/zadar/scripts/refresh-mvs.sh >> /var/log/zadar/refresh.log 2>&1
```

If you want `CONCURRENTLY`, ensure the matview has a unique index; otherwise remove CONCURRENTLY and run during off-hours.

Extra tips for a beginner

- Use the temporary `node:20` container approach so you don't need Node installed on the VPS permanently.
- Keep credentials out of plain text: store in environment files or use Docker secrets for production.
- Test the full flow once on a staging VPS before running in production.

If you want, I can create a `backend/README.deploy.md` with these exact commands placed in the repo (or create a small `deploy.sh` that encapsulates the steps). Which would you prefer?
