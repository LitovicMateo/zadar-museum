## Purpose

Short, actionable guidance for AI coding agents working in this repository.

## Quick architecture snapshot

- **Frontend:** React + TypeScript + Vite in frontend/ (dev: `npm run dev`, build: `npm run build`). See [frontend/package.json](frontend/package.json).
- **Backend:** Strapi v5 app in backend/ (dev: `npm run develop`, build: `npm run build`). See [backend/package.json](backend/package.json).
- **Database:** Postgres used for production and local dev; materialized views and SQL are under `sql/` (organized in `Layer 1`, `Layer 2`, `Layer 3`). Docker compose mounts `./sql` into the backend container. See [docker-compose.yml](docker-compose.yml).

## Primary workflows agents should know

- **Local dev (recommended):** Run the compose stack in development mode: docker compose up --build (uses docker-compose.yml which starts postgres, backend (Strapi in develop mode) and frontend (Vite)). See [docker-compose.yml](docker-compose.yml).
- **Backend quick commands:**
  - Dev: cd backend && npm ci && npm run develop
  - Run MVs script: cd backend && npm run migrate:mvs (runs ./scripts/apply-mvs.js). See [backend/package.json](backend/package.json) and [backend/scripts/apply-mvs.js](backend/scripts/apply-mvs.js).
- **Frontend quick commands:**
  - Dev: cd frontend && npm ci && npm run dev
  - Build: cd frontend && npm run build (build runs tsc -b && vite build). See [frontend/package.json](frontend/package.json).
- **Production deploy:** Uses docker-compose.vps.yml / docker-compose.prod.yml and the scripts in repository README. Typical sequence: docker-compose -f docker-compose.vps.yml pull then docker-compose -f docker-compose.vps.yml up -d --force-recreate.

## Database / data workflows (critical)

- Production dump creation and safe import on Windows are documented in the repo README; follow the exact commands there to avoid encoding corruption. See [README.md](README.md).
- Important details to preserve: use PGCLIENTENCODING=UTF8 when importing via psql and stream raw bytes in PowerShell with Get-Content -Encoding Byte -ReadCount 0 | docker exec -i ... to avoid PowerShell re-encoding.

## Project-specific conventions and patterns

- SQL is organized into layered materialized views under sql/Layer 1, sql/Layer 2, sql/Layer 3. Materialized-view related Node helpers live in backend/scripts.
- The backend container mounts ./sql read-only so Node scripts can read SQL files at runtime. See the volumes entry for backend in [docker-compose.yml](docker-compose.yml).
- Build-time injection for the frontend API root: Docker and Vite use VITE_API_ROOT as build arg / env var. Check frontend/Dockerfile and vite.config.ts for usage.
- Strapi config: backend/config/server.ts centralizes host/port, PUBLIC_URL handling, ADMIN_URL, and runtime flags (proxy, webhooks). Override via env vars in compose files or your shell.

## Integration points to pay attention to

- Strapi <-> Postgres: env-driven connection (DATABASE\_\* env vars). See [docker-compose.yml](docker-compose.yml) and [backend/package.json](backend/package.json) scripts.
- Frontend <-> Backend: CORS origins default set in docker-compose for dev; production relies on PUBLIC_URL and VITE_API_ROOT.
- Types: frontend uses strapi-to-typescript and generated types live under types/generated — keep these in sync if you change Strapi content-types.

## Files to inspect first when troubleshooting

- [docker-compose.yml](docker-compose.yml) — dev composition, mounts, ports
- [docker-compose.vps.yml](docker-compose.vps.yml) — production composition
- [backend/package.json](backend/package.json) and backend/scripts/\* — backend scripts and npm aliases
- [frontend/package.json](frontend/package.json) and vite.config.ts — frontend build/dev commands and env wiring
- sql/ — all SQL materialized views and transformations
- [backend/config/server.ts](backend/config/server.ts) — Strapi runtime choices and env expectations

## Example tasks with concrete hints

- Add a new materialized view:
  - Place SQL in the appropriate sql/Layer X/... directory.
  - Update or run node backend/scripts/apply-mvs.js (or npm run migrate:mvs) to apply.
  - Verify by connecting to Postgres in the dev container: docker exec -it postgres_dev psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}.
- Update frontend API calls when backend route changes:
  - Update VITE_API_ROOT in your local env (or Docker build args) and run npm run dev in frontend.

## What not to assume

- There is no single monorepo build command — frontend and backend are developed and built independently (compose orchestrates them). Do not assume npm install in root affects subprojects.
- Envs are authoritative: many defaults are set in compose files and backend/config/server.ts; prefer checking env values when behavior differs between local and VPS.

## Quick reference commands

    # Full dev stack (rebuild):
    docker compose up --build

    # Backend dev (inside backend/):
    npm ci
    npm run develop

    # Apply materialized views via Node helper (backend/):
    npm run migrate:mvs

    # Frontend dev (inside frontend/):
    npm ci
    npm run dev

    # Build production images on VPS (example):
    docker-compose -f docker-compose.vps.yml pull
    docker-compose -f docker-compose.vps.yml up -d --force-recreate

## Feedback request

If any important workflow or file is missing from this summary, tell me what to add and I'll merge it into this file.
