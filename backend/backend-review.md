# Backend API Review — Strapi project

Date: 2025-12-20

Summary

- This document lists issues observed in the backend API (based on the provided API folder structure) and gives targeted recommendations — including best practices for custom routes and maintainability.

Key observations

- The `src/api` folder contains many APIs (coach, competition, game, player, referee, team, etc.).
- Many directories contain both `.ts` and `.js` versions of controllers/services/routes (e.g. `controllers/coach.js` and `controllers/coach.ts`).
- Several APIs include files named `01-custom.ts` (or `.js`) alongside standard route files.
- There are SQL scripts and migration-related files under `database/` and `scripts/`.

Issues found (grouped by type)

1. Mixed language artifacts (concrete)

- Multiple APIs include both `.ts` and `.js` source files in the same directories (e.g. `controllers/coach.js` and `controllers/coach.ts`).
- Risk: confusion about canonical source, accidental edits to compiled artifacts, larger diffs, and CI/build problems.

2. Committed build/compiled files (probable)

- Presence of `.js` files next to `.ts` suggests compiled output is committed.
- Risk: stale/unsynchronized compiled files, accidental execution of JS instead of TS, and merge conflicts.

3. Route naming and discoverability

- Use of numeric-prefixed filenames like `01-custom.ts` is non-descriptive and relies on ordering rather than intent.
- Risk: poor readability, harder navigation, and fragile ordering if files are renamed or reordered.

4. Maintainability of custom endpoints

- Multiple custom-route files suggest business logic might be split between routes/controllers/services inconsistently.
- Risk: duplication of logic across controllers and services and difficulty tracing responsibilities.

5. Lack of visible API documentation

- No OpenAPI/Swagger manifest visible in the API folder; routes may be undocumented.
- Risk: onboarding friction and brittle integrations.

6. Potential security and protection gaps (observations)

- Special endpoints (e.g., `refresh`) that alter DB or rebuild views require strict access control; ensure policies are applied.
- Risk: accidental or unauthorized execution in production.

7. Testing and CI (absence)

- No tests were visible in the provided tree for the backend; no clear CI descriptions for lint/type checks.
- Risk: regressions and low confidence deploying changes.

8. Error handling, logging, and validation (assumptions)

- Can't see implementations, but typical gaps are missing centralized error handling, insufficient input validation, and inconsistent logging.
- Recommendation: confirm use of policies, validation layers (Joi/Zod/Strapi validations) and structured logging.

9. Raw SQL and migration handling

- There are SQL files and scripts — ensure parameterized queries and that migrations are applied via a deterministic process.

Recommendations (high priority)

- Remove compiled artifacts from source control

  - Delete committed `.js` files that are produced from `.ts` build output.
  - Add appropriate ignore rules to `.gitignore` (e.g., `dist/`, `build/`, `**/*.js` if generated) while preserving any intentionally committed JS.
  - Keep a single source-of-truth language (prefer TypeScript for type safety).

- Consolidate and clarify routes

  - Replace numeric filenames like `01-custom.ts` with descriptive names, e.g. `routes/custom-competition.ts` or `routes/competition-custom.ts`.
  - Keep each route file focused on route declarations only; move business logic to services.
  - Use a consistent convention: `controllers/*`, `services/*`, `routes/*`, `content-types/*`.

- Version and namespace custom routes

  - Prefix custom routes with a clear namespace and version: e.g., `/api/v1/refresh` or `/api/internal/refresh`.
  - Keep internal/admin-only endpoints under a distinct prefix and enforce stricter policies.

- Centralize policies and validation

  - Use Strapi policies (or middleware) for auth, role checks, and rate-limiting.
  - Validate external inputs at the edge (DTOs/validation schemas) in controllers/services.

- Keep controllers thin, services authoritative

  - Controllers: parse/validate request, call services, return responses.
  - Services: contain business logic and DB interactions; make them testable in isolation.

- Automate docs and API discovery

  - Add an OpenAPI/Swagger spec (can be generated) and/or a route README for each API.
  - Document custom endpoints and expected permissions in each API folder's README.

- Add tests and CI checks

  - Add unit tests for services and integration tests for routes (tooling: Jest, Vitest, Supertest).
  - Add CI steps: `npm run lint`, `npm run type-check`, `npm test`, and a build step.

- Harden security posture

  - Review `refresh`, `apply-mvs` and other DB-affecting scripts: require admin-only access and non-production environment checks.
  - Enforce parameterized queries for any raw SQL and audit scripts for secrets.
  - Add rate limiting, logging, and error sanitization for public endpoints.

- Improve logging and observability
  - Use structured logging (pino/winston) with context (request id, user id).
  - Centralize error handling and ensure consistent HTTP error payloads.

Best practices for custom routes (maintainability)

1. Keep route files minimal and descriptive

- A route file should only map HTTP verbs/paths to controller handlers; name files by purpose (e.g., `routes/refresh.ts`, `routes/team-stats-custom.ts`).

2. Move business logic to services

- Services are the single source of truth for business operations; controllers delegate to services. This makes logic reusable and testable.

3. Use versioning and namespaces

- Expose custom endpoints under versioned paths (e.g., `/api/v1/...`) or under a clear `internal`/`admin` namespace when they are not public.

4. Enforce policies at the route level

- Attach Strapi policies or middleware to protect routes (auth, role checks, rate limiting). Avoid ad-hoc checks inside service logic.

5. Document custom endpoints next to the code

- Each `routes/*.ts` should have a short header comment or a small `README.md` describing path, method, required permissions, expected body/response.

6. Keep file structure predictable and consistent

- Standard pattern: `api/<name>/controllers/*.ts`, `api/<name>/services/*.ts`, `api/<name>/routes/*.ts`, `api/<name>/content-types/*`.

7. Use integration and contract tests for custom routes

- Write tests that assert route-level behavior (status codes, policy enforcement, side-effects). This prevents regressions.

8. Prefer feature flags or environment gating for destructive custom endpoints

- For endpoints that rebuild views or change production state, gate them behind env flags and require additional checks or confirmations.

Quick actionable cleanup tasks

- Remove/generated `.js` files and add proper `.gitignore` entries.
- Rename `01-custom.ts` files to descriptive names and update imports/routes accordingly.
- Add an `api/README.md` describing conventions and how to add custom routes.
- Add a CI workflow that runs lint, types, and tests.

Next steps I can take for you (pick any)

- Run a quick search for duplicated `.js` files and prepare a patch to remove them.
- Generate a checklist/PR that renames `01-custom.ts` files to descriptive names.
- Add a small example `routes/` → `controllers/` → `services/` refactor for one API to demonstrate the pattern.
- Create a minimal OpenAPI spec listing existing custom endpoints.

End of review
