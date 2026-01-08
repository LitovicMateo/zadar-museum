**Project Overview**

- **Name:** Zadar (monorepo with frontend, backend and DB artifacts).
- **Purpose:** A web application for managing and viewing basketball (or sports) data, including teams, players, games, referee stats, and various aggregated views. The repo contains a Strapi-based backend, a Vite + React frontend, SQL/materialized views, and Docker compose files to run the full stack locally or in production.

**High-level Architecture**

- **Backend:** `backend/` — A Strapi application (Node.js). It exposes REST/GraphQL APIs, contains migrations, scripts and utilities. Key scripts live in `backend/scripts/`.
- **Frontend:** `frontend/` — A Vite + React application (TypeScript). UI components, pages and assets are here.
- **Database / SQL:** `sql/` and `backend/database/` — SQL layers and migrations; several materialized views and helper scripts. There is a full DB dump at `zadar_backup.sql`.
- **Reverse proxy / TLS / Config:** `nginx/` — nginx config variants for local, prod and VPS deployments.
- **Orchestration / Containers:** Root-level Docker Compose files (`docker-compose.yml`, `docker-compose.local.override.yml`, `docker-compose.prod.yml`, `docker-compose.vps.yml`) define the services for local and production deployments.

**Key Folders**

- `backend/` — Strapi app, API routes, config and backend scripts.
- `frontend/` — React/Vite app and its build/config.
- `sql/` — SQL layers for materialized views and reporting logic.
- `nginx/` — nginx configs for different environments.
- `scripts/` — helper scripts for deployment, importing player records and pushing images.

**Main Local Commands**

- **Start the whole stack (Docker Compose):**

  - `docker compose -f docker-compose.yml -f docker-compose.local.override.yml up --build -d`
  - Stop: `docker compose -f docker-compose.yml -f docker-compose.local.override.yml down`

- **Backend (Strapi) - run locally (no Docker):**

  - `cd backend`
  - `npm install`
  - `npm run develop` (or `npm run dev`) — starts Strapi in development mode.

  Migrate MVs to Postgres

  ```
    docker-compose exec backend npm run migrate:mvs
  ```

  You can pass flags to control behavior when materialized views already exist:

  - Refresh existing matviews instead of attempting to create them:

    ```
    # refresh all detected matviews (inside backend folder)
    cd backend && npm run migrate:mvs -- --refresh

    # via Docker
    docker-compose exec backend npm run migrate:mvs -- --refresh
    ```

  - Force drop and recreate matviews from SQL files:

    ```
    cd backend && npm run migrate:mvs -- --force
    docker-compose exec backend npm run migrate:mvs -- --force
    ```

  - Use concurrent refresh (attempts `REFRESH MATERIALIZED VIEW CONCURRENTLY` then falls back):

    ```
    cd backend && npm run migrate:mvs -- --refresh --concurrent
    docker-compose exec backend npm run migrate:mvs -- --refresh --concurrent
    ```

  Notes:

  - `--refresh` runs a REFRESH for detected matviews instead of skipping creation.
  - `--force` will DROP the matview (if exists) and then execute the SQL file to recreate it.
  - Concurrent refresh requires a supporting unique index; the script falls back to non-concurrent refresh if concurrent refresh fails.

- **Frontend (Vite) - run locally (no Docker):**

  - `cd frontend`
  - `npm install`
  - `npm run dev` — starts Vite dev server.

- **Run backend helper scripts** (use either local Node or run inside container):

  - Apply materialized views (MVs): `cd backend && npm run migrate:mvs`
    - This runs `node ./scripts/apply-mvs.js` (see `backend/package.json` `migrate:mvs`).
    - Or, if running via Docker: `docker compose exec backend npm run migrate:mvs` (service name may vary).
  - Refresh team views: `cd backend && npm run refresh:team` (runs `node ./scripts/refresh-team-views.js`).

- **Run scripts from top-level `scripts/`:**

  - Example: `scripts/apply_player_records_in_container.sh` — for applying player records inside a container.
  - Push images: `scripts/push-backend-to-ghcr.ps1` / `.sh` and `scripts/push-frontend-to-ghcr.ps1` / `.sh`.

- **Restore DB from SQL dump (example):**
  - Local Postgres (hosted): `psql -U <user> -d <db> -f zadar_backup.sql`
  - Inside Docker (example): `docker compose exec db psql -U <user> -d <db> -f /path/in/container/zadar_backup.sql`

**Environment & Requirements**

- **Node:** `>=18.x` (see `backend/package.json` engines). Strapi version is defined in `backend/package.json`.
- **npm / pnpm / yarn:** Use the package manager you prefer; examples above use `npm`.
- **Docker:** Recent Docker / Docker Compose CLI is recommended for containerized local development.

**Helpful Notes & Tips**

- If you prefer running only parts of the stack, start the DB + backend first, then the frontend.
- The `docker-compose.local.override.yml` contains local-only overrides — it is merged with `docker-compose.yml` when you start the stack with both files.
- Materialized views and reporting SQL are under `sql/` and are sometimes applied using the backend helper script `backend/scripts/apply-mvs.js`.
- Use `docker compose exec <service> <cmd>` to run administrative commands inside containers (replace `<service>` with the actual service name from your compose file, often `backend`, `db`, or `frontend`).

**Useful References**

- Backend dev: `backend/README.md` (Strapi-specific notes).
- Frontend dev: `frontend/README.md`.
- Deployment notes: `README.deploy.md` and `scripts/` helpers.

If you want, I can also:

- add a short quickstart script showing exact commands for a fresh machine (install Docker, Node, build, run),
- or create a troubleshooting checklist for common errors when starting the stack.
