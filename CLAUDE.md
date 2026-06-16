# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zadar Basketball Museum — a web application for managing and browsing historical Croatian basketball data (players, teams, games, coaches, referees, venues, leagues). The monorepo contains a Strapi 5 backend, a React/Vite frontend, PostgreSQL materialized views for aggregated stats, and Docker Compose files for all environments.

## Commands

### Full stack (Docker — recommended)

```bash
make dev              # start dev stack (postgres + backend + frontend + pgadmin)
make dev-stop         # stop dev stack
make dev-logs-backend # tail backend logs
make dev-mv           # apply/refresh materialized views against running dev DB
make backup-dev       # dump dev DB to zadar-backup.sql
make load-dev-backup  # copy zadar-backup.sql into the postgres container
make import-dev-backup # import the copied dump
```

Dev services: frontend → http://localhost:5173, backend/Strapi → http://localhost:1337, pgAdmin → http://localhost:5051

### Frontend (standalone)

```bash
cd frontend
npm run dev           # Vite dev server (port 5173)
npm run build         # TypeScript check + Vite build
npm run lint          # ESLint
npm test              # Vitest (watch mode)
npm run test:coverage # coverage report
```

Run a single test file:
```bash
cd frontend && npm test -- src/path/to/file.test.tsx
```

### Backend (standalone)

```bash
cd backend
npm run develop       # Strapi dev mode with hot reload
npm run build         # production build
npm test              # Jest
npm run test:coverage
npm run migrate:mvs   # apply/refresh materialized views (node ./scripts/apply-mvs.js)
npm run migrate:mvs -- --refresh           # REFRESH existing matviews
npm run migrate:mvs -- --force             # DROP + recreate from SQL files
npm run migrate:mvs -- --refresh --concurrent  # concurrent refresh (falls back if no unique index)
```

Run a single test file:
```bash
cd backend && npm test -- src/path/to/file.test.ts
```

## Architecture

### Backend — Strapi 5

Located in `backend/`. Strapi manages the content-type schema. Every entity (player, team, game, coach, referee, staff, venue, competition, player-stats, team-stats) has the standard Strapi quadruple under `src/api/{entity}/`: `content-types/`, `controllers/`, `services/`, `routes/`.

**Auth model**: All GET routes are public (`auth: false`). All write operations (POST/PUT/DELETE) are protected by the `global::require-auth-for-writes` policy at `src/policies/require-auth-for-writes.ts`. There is no per-role granularity — any authenticated Strapi user can write.

**Validation**: Input is validated at the service layer with Zod schemas in `src/validation/`. The `validateWhitelist` helper guards dynamic table/DB name interpolation against `ALLOWED_DATABASES` to prevent SQL injection via table names.

**Custom queries**: Services query materialized views directly via `strapi.db.connection` (Knex) rather than through the Strapi ORM when accessing pre-aggregated stats tables.

**Stats/refresh endpoints**: Aggregated stats are read from materialized views by the `stats` and `refresh` API modules (`src/api/stats/`, `src/api/refresh/`).

### Frontend — React + Vite

Located in `frontend/`. Entry point: `src/main.tsx` → `src/App.tsx` → route tree.

**Routing** (`src/routes/`):
- `AppRoutes.tsx` — entity detail/list pages (players, teams, games, referees, coaches, venues, leagues, staff). All wrapped in `ProtectedRoute`.
- `DashboardRoutes.tsx` — CRUD forms at `/dashboard/{entity}/create` and `/dashboard/{entity}/edit`.
- `StatsRoutes.tsx` — aggregated stat tables at `/stats/{player,team,player-records,team-records,coach,referee}`.

**Data fetching**: All queries use TanStack Query v5 via a custom wrapper `UseQueryWithToast` (`src/hooks/UseQueryWithToast.ts`) that adds toast error notifications. Query hooks live in `src/hooks/queries/{entity}/`. Mutations (create/update) are in `src/services/{entity}/Create*.ts` and `Update*.ts`.

**API client**: Centralised Axios instance at `src/lib/ApiClient.ts`. Request interceptor reads `jwt` from `localStorage` and attaches `Authorization: Bearer`. Response interceptor clears auth and redirects to `/login` on 401.

**Auth**: `AuthContext` + `AuthProvider` (`src/providers/AuthProvider.tsx`). JWT and user stored in `localStorage`. `ProtectedRoute` redirects unauthenticated users to `/login`. Login calls the Strapi `POST /api/auth/local` endpoint.

**API route constants**: All endpoint paths are centralised in `src/constants/Routes.ts` (`API_ROUTES`). The base is `/api` (requests are proxied by nginx in Docker or by Vite's dev proxy).

### Database — PostgreSQL + Materialized Views

Strapi manages its own tables. On top of those, a set of PostgreSQL materialized views provides base boxscore data. The SQL source lives in `sql/Layer 1/` and contains four views:

- `player_boxscore` — one row per player per game with all stat columns
- `team_boxscore` — one row per team per game with team stat columns
- `coach_boxscore` — one row per coach per game with win/loss columns
- `schedule` — one row per game with venue, score, and referee columns
- `zz_layer1_indexes.sql` — indexes over the above views (runs unconditionally)

All aggregated stats (player totals/averages, team records, coach records, referee stats, venue records, competition/league rankings) are now computed at query time in `backend/src/lib/aggregation/queries.ts` rather than stored in pre-built materialized views. The previous Layer 2 and Layer 3 MV trees have been removed.

`backend/scripts/apply-mvs.js` walks `sql/Layer 1/` and creates or refreshes each view. This script is run via `make dev-mv` locally or `make apply-mvs-staging` / `make apply-mvs-prod` for other environments.

### Docker Compose Environments

| File | Env file | Purpose |
|------|----------|---------|
| `docker-compose.dev.yml` | `.env.dev` | Local development |
| `docker-compose.staging.yml` | `.env.staging` | Staging |
| `docker-compose.prod.yml` | `.env.prod` | Production |
| `docker-compose.vps.yml` | — | Direct VPS deployment |

All `make` targets wrap the correct compose file + env file pair. Use `make help` for a full target list.

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
