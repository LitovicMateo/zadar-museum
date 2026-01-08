# Coach API Review

Repository location: backend/src/api/coach

## Summary

This document reviews the `coach` Strapi API implementation (controllers, services, routes, and content-type schema) and gives actionable suggestions. The attached folder contains TypeScript and JavaScript variants plus a `content-types/coach/schema.json`. The review focuses on architecture, maintainability, correctness, security, performance, and DX (developer experience).

## High-level findings

- Mixed JS and TS sources: both `.ts` and compiled `.js` files appear present for controllers, services, and routes. This increases repository noise and can cause confusion about the canonical source of truth.
- Standard Strapi separation (content-types, controllers, services, routes) is followed, which is good. Presence of `01-custom.ts` suggests custom endpoints beyond the default blueprints.
- There is likely room for stronger typing, consistent error handling, input validation, and clearer permission checks.

## Detailed review and suggestions

# Coach API Review (expanded)

Repository location: backend/src/api/coach

## Summary

This expanded document walks through each recommendation from the initial review and provides concrete code examples, rationale, and next-step guidance. The goal is to make it easy to produce small, safe PRs that improve correctness, security, and maintainability for the `coach` API.

## How to use this document

- Read the high-level recommendation, then review the code example and the rationale.
- Use the "PR checklist" at the end to create focused, incremental pull requests.

---

## 1) Project hygiene and repo layout

Recommendation

- Keep only source files under `src/`. Do not commit compiled artifacts (`.js`) when `.ts` sources exist. Use a clean build output directory (`dist/` or `build/`) and add it to `.gitignore`.

Example `.gitignore` additions

```
# TypeScript build outputs
dist/
build/
**/*.js
**/*.js.map

# Keep node_modules out
node_modules/
```

Commands to remove tracked compiled files from git while keeping them locally:

```powershell
git rm --cached backend/src/api/coach/**/*.js
git commit -m "chore: remove compiled JS from repo for coach API"
```

Rationale

- Keeping only `.ts` sources prevents merge conflicts and avoids uncertainty about which files are authoritative. The CI/build pipeline should compile TypeScript during Docker image builds.

---

## 2) Content-type schema (Strapi model)

Recommendation

- Define attribute types, `required`, `unique`, `private` settings, and relations in `content-types/coach/schema.json`. Prefer validation at the model level for core constraints (required fields, unique indexes), and use controllers/services for business rules.

Example `schema.json` snippet

```json
{
  "collectionName": "coaches",
  "info": { "singularName": "coach", "pluralName": "coaches" },
  "options": { "draftAndPublish": false },
  "attributes": {
    "name": { "type": "string", "required": true },
    "email": { "type": "email", "required": true, "unique": true },
    "phone": { "type": "string" },
    "privateNotes": { "type": "text", "private": true },
    "team": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::team.team"
    }
  }
}
```

Rationale

- Putting basic validations in the schema reduces duplicated checks and ensures Strapi's internal mechanisms (e.g., admin UI, entityService) behave consistently.

---

## 3) Controllers — patterns and examples

Recommendation

- Keep controllers thin: validate input, call service methods, map errors to HTTP responses, and ensure consistent response shapes.
- Centralize error handling with a small wrapper to reduce boilerplate.

Controller helper: `src/lib/handleController.ts`

```ts
import { Context } from "koa";

export function handleController(fn: (ctx: Context) => Promise<void>) {
  return async (ctx: Context) => {
    try {
      await fn(ctx);
    } catch (err: any) {
      // Structured logging
      strapi.log.error({ err, path: ctx.path, user: ctx.state?.user?.id });

      // Map known error types
      if (err.name === "ValidationError") {
        ctx.status = 422;
        ctx.body = {
          error: {
            code: "VALIDATION_ERROR",
            message: err.message,
            details: err.details,
          },
        };
        return;
      }

      if (err.name === "NotFoundError") {
        ctx.status = 404;
        ctx.body = { error: { code: "NOT_FOUND", message: err.message } };
        return;
      }

      ctx.status = err.status || 500;
      ctx.body = {
        error: { code: "INTERNAL_ERROR", message: "Internal server error" },
      };
    }
  };
}
```

Example controller using `zod` validation and service layer

```ts
import { z } from "zod";
import { handleController } from "../../lib/handleController";
import * as coachService from "../services/coach";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  team: z.number().nullable(),
});

export default {
  create: handleController(async (ctx) => {
    const payload = createSchema.parse(ctx.request.body);
    const coach = await coachService.createCoach(payload);
    ctx.status = 201;
    ctx.body = { data: coach };
  }),
};
```

Rationale

- Using a wrapper reduces duplicated try/catch blocks and forces consistent logging and response shapes. `zod` provides clear parse errors which you can map to 422 responses.

---

## 4) Services — data access and business logic

Recommendation

- Services should encapsulate data access and core business rules. Controllers should not access `strapi.entityService` directly for complex logic — instead, call service functions.

Example service: `src/api/coach/services/coach.ts`

```ts
import { knex } from "knex";

export async function findCoachById(id: number) {
  const coach = await strapi.entityService.findOne("api::coach.coach", id, {
    populate: ["team"],
  });
  return coach || null;
}

export async function createCoach(data: any) {
  // Business rule example: ensure no duplicate email (DB unique + service double-check)
  const existing = await strapi.entityService.findMany("api::coach.coach", {
    filters: { email: data.email },
  });
  if (existing.length) {
    const err = new Error("Coach with that email already exists");
    err.name = "ValidationError";
    (err as any).details = { email: "duplicate" };
    throw err;
  }

  const created = await strapi.entityService.create("api::coach.coach", {
    data,
  });
  return created;
}
```

Transaction example (Knex)

```ts
export async function createCoachWithTeams(data: any, teamIds: number[]) {
  const knex = strapi.db.connection;
  return await knex.transaction(async (trx) => {
    const created = await strapi
      .query("api::coach.coach")
      .create({ data }, { transacting: trx });
    // associate teams using transaction
    for (const teamId of teamIds) {
      await strapi
        .query("api::coach-coaches-teams")
        .create(
          { data: { coach: created.id, team: teamId } },
          { transacting: trx }
        );
    }
    return created;
  });
}
```

Rationale

- Isolating data logic in services makes code easier to test and reuse. Using Strapi's entityService ensures compatibility with Strapi lifecycle hooks and plugins.

---

## 5) Routes and custom endpoints

Recommendation

- Keep routes documented and add `config` sections to attach policies and response schemas.

Example `routes/01-custom.ts`

```ts
export default [
  {
    method: "POST",
    path: "/coaches",
    handler: "coach.create",
    config: {
      policies: ["global::is-authenticated"],
      description: "Create a coach (requires authentication)",
    },
  },
];
```

Rationale

- Explicit route configs improve discoverability and make it easy to attach RBAC policies.

---

## 6) Authentication & Authorization

Recommendation

- Always validate caller permissions in policies for custom endpoints. Use role-based access controls for admin vs public routes.

Example policy: `src/policies/is-authenticated.ts`

```ts
export default async (ctx, next) => {
  if (!ctx.state.user) {
    ctx.unauthorized("You must be logged in");
    return;
  }
  return await next();
};
```

Attach the policy to routes that require auth (see routes example above).

Rationale

- Relying on `ctx.state.user` and centralized policies prevents unauthorized access and keeps controllers focused on business logic.

---

## 7) Input validation & sanitization (detailed)

Recommendation

- Validate all custom endpoint inputs using a schema library, and sanitize outputs that may contain HTML.

Example validation middleware using `zod` (reusable)

```ts
import { z } from "zod";

export function validateBody(schema: z.ZodSchema<any>) {
  return async (ctx, next) => {
    try {
      ctx.request.body = schema.parse(ctx.request.body);
    } catch (err: any) {
      err.name = "ValidationError";
      throw err;
    }
    return next();
  };
}
```

Usage in route config

```ts
// attach validateBody(createSchema) as a policy or middleware for the create route
```

Sanitization

- For rich text fields, sanitize using libraries like `dompurify` (server-side DOMPurify) or `sanitize-html` before persisting or before sending to clients, depending on needs.

Rationale

- Validation avoids server-side surprises and gives clients fast, clear error messages. Sanitization prevents stored XSS.

---

## 8) Error handling and logging (structured)

Recommendation

- Use `strapi.log` for structured logs and include contextual metadata (request id, user id, route).
- Return a consistent error envelope for all endpoints.

Example log usage

```ts
strapi.log.info({
  msg: "Coach created",
  coachId: created.id,
  userId: ctx.state.user?.id,
});
```

Error envelope example

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already exists",
    "details": { "email": "duplicate" }
  }
}
```

Rationale

- Structured logs are machine-parsable and help with incident investigations. A consistent error envelope simplifies client-side error handling.

---

## 9) Performance and DB concerns

Recommendation

- Always consider `populate` to avoid N+1 problems and provide pagination and limits for list endpoints.

Example: list endpoint with pagination and safe populate

```ts
export async function listCoaches(ctx) {
  const page = Math.max(1, Number(ctx.query.page) || 1);
  const pageSize = Math.min(100, Number(ctx.query.pageSize) || 20);

  const result = await strapi.entityService.findMany("api::coach.coach", {
    filters: {},
    populate: { team: true },
    start: (page - 1) * pageSize,
    limit: pageSize,
  });

  ctx.body = { data: result };
}
```

Rationale

- Pagination avoids heavy responses and reduces DB load. Controlled `populate` reduces N+1 queries by loading relations in a single query.

---

## 10) Transactions and data consistency

Recommendation

- Use DB transactions for multi-step changes. Prefer transactions when creating multiple related records.

Knex transaction example (see Services section above)

Rationale

- Transactions prevent partial writes and keep data consistent.

---

## 11) TypeScript and typing

Recommendation

- Define shared types for `Coach` DTOs and use them across controllers/services. Keep mapping logic isolated.

Example `types/coach.ts`

```ts
export interface CoachDTO {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  team?: number | null;
}
```

Adapter example

```ts
export function toCoachDTO(entity: any): CoachDTO {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    phone: entity.phone,
    team: entity.team?.id ?? null,
  };
}
```

Rationale

- Explicit types make refactors safer and give better editor/CI checks.

---

## 12) Security

Recommendation

- Prevent over-posting by whitelisting allowed fields before passing data to entityService.

Example helper

```ts
const allowedFields = ["name", "email", "phone", "team"];
function pickAllowed(body: any) {
  return Object.fromEntries(
    Object.entries(body).filter(([k]) => allowedFields.includes(k))
  );
}

// usage
const safeData = pickAllowed(ctx.request.body);
await strapi.entityService.create("api::coach.coach", { data: safeData });
```

Rationale

- This prevents attackers from setting unexpected fields (e.g., `isAdmin`) accidentally exposed by the model.

---

## 13) Tests and CI

Recommendation

- Add unit tests for services and integration tests for controllers using `jest` and `supertest` (or Strapi test helpers) and run them in CI.

Example unit test for service (Jest)

```ts
import * as coachService from "../../src/api/coach/services/coach";

test("createCoach duplicates email", async () => {
  // Use test DB or mock entityService
  jest.spyOn(strapi.entityService, "findMany").mockResolvedValue([{ id: 1 }]);
  await expect(
    coachService.createCoach({ name: "A", email: "a@a.com" })
  ).rejects.toThrow("Coach with that email already exists");
});
```

CI snippet (GitHub Actions)

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: "18" }
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

Rationale

- Tests prevent regressions and give confidence for automated refactors.

---

## 14) Documentation and DX

Recommendation

- Add a `README.md` under `backend/src/api/coach` documenting endpoints, payloads, permissions and examples. Optionally add OpenAPI annotations or a small generated spec.

Example README section

```
POST /api/coaches
 - Auth: required
 - Body: { name: string, email: string, team?: number }
 - Responses: 201 { data: Coach }
```

Rationale

- Good documentation speeds up future contributors and supports client teams integrating with the API.

---

## PR checklist (concrete steps)

- [ ] Remove compiled `.js` files from `backend/src/api/coach` and update `.gitignore`.
- [ ] Add `src/lib/handleController.ts` and refactor one controller action to use it.
- [ ] Add `zod` validation and attach either as middleware or directly in controller for at least one custom endpoint.
- [ ] Add a small `types/coach.ts` and an adapter function.
- [ ] Add one unit test for a service and run it in CI.
- [ ] Add `backend/src/api/coach/README.md` documenting custom endpoints.

---

If you'd like, I can now implement one of the checklist items as a PR. Pick one and I'll prepare the patch:

- Remove compiled `.js` files and update `.gitignore`
- Add `handleController` and update `controllers/coach.ts` to use it
- Add `zod` validation and attach it to a custom route

If you want all three smaller PRs, I can create them sequentially.
