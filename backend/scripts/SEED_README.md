# Seed Dummy Data

This file explains how to run the SQL seed script `seed_dummy_data.sql` to populate the local Postgres used by the backend.

Quick steps (PowerShell):

1. If your Postgres is running locally and accessible, run:

```powershell
psql -h localhost -U <username> -d <database> -f backend/scripts/seed_dummy_data.sql
```

2. If Postgres runs in Docker compose (example service name `db`), run the script inside the container:

```powershell
docker-compose exec db psql -U <username> -d <database> -f /srv/app/backend/scripts/seed_dummy_data.sql
```

Notes:

- Replace `<username>` and `<database>` with your DB credentials (commonly `postgres` and `postgres` or `strapi`).
- The script inserts sample rows and advances sequences; it uses high id values (1000+) to avoid collisions.
- If your schema differs, review `backend/scripts/seed_dummy_data.sql` and adapt IDs and table/column names accordingly.

If you want, I can also run the script for you (if you provide the DB connection details or let me run it inside your docker-compose environment).
