# Dashboard Overhaul — Design Spec

**Date:** 2026-06-16  
**Status:** Approved

---

## Context

The current admin dashboard has no list view. Each entity section redirects directly to a create form, and editing requires selecting an item from an inline dropdown. There is no way to browse, search, or delete records from the UI. This overhaul adds a proper paginated list page per entity as the primary landing view, with inline edit/delete actions and server-side search.

---

## Goals

- Sidebar becomes pure navigation: each label navigates to the entity list page
- List page: paginated (20/page), server-side search, "Create new" button, Edit + Delete per row
- Edit page: ID comes from the URL (no more dropdown selector)
- Create/Edit wrapper components consolidated into one per entity
- shadcn component library installed for new UI components
- react-select replaces native `<select>` elements inside forms
- Form internals (Provider, Content, Fields, Zod schema, reset logic) are not changed

---

## Architecture

### Routing changes (`DashboardRoutes.tsx`)

Each entity block gains a `list` route and `edit/:id` replaces `edit`:

```
/dashboard/player           → redirect to /dashboard/player/list
/dashboard/player/list      → PlayerListPage (new)
/dashboard/player/create    → PlayerFormPage (replaces CreatePlayer)
/dashboard/player/edit/:id  → PlayerFormPage (replaces EditPlayer)
```

Same pattern for all 10 entities: player, team, coach, referee, staff, game, venue, competition, player-stats, team-stats.

### Sidebar (`DashboardSidebar.tsx`, `DashboardSidebarRow.tsx`)

- Remove the ＋ and ✏ icon buttons from each row
- Each row becomes a `<Link>` to `/dashboard/{entity}/list`
- Active state: highlight row when current path starts with `/dashboard/{entity}`
- `navItems` in `Dashboard.tsx` updated: `createPath` / `editPath` properties removed, replaced with `listPath`

### List page — `EntityListPage` (generic, `src/components/Dashboard/EntityListPage/`)

Single reusable component driven by a per-entity config object:

```ts
interface EntityListConfig<T> {
  title: string
  entityType: string           // used for query key and API route
  columns: ColumnDef<T>[]      // shadcn table column definitions
  searchPlaceholder: string
  createPath: string
  editPath: (id: string) => string
  deleteLabel: (row: T) => string  // used in confirmation dialog: "Delete Krešimir Ćosić?"
}
```

**Layout (top to bottom):**
1. Header row: title + subtitle (total count) on left, "Create new {entity}" button on right
2. Controls row: search input (left) + "Showing X–Y of Z" + Prev/Next pagination (right)
3. shadcn `Table` with columns per entity config
4. Each row: data columns + Edit button (blue) + Delete button (red)

**Delete flow:**
- Click Delete → shadcn `AlertDialog` opens: "Are you sure you want to delete [name]?" with Cancel / Delete buttons
- Confirm → `useMutation` calls delete service → invalidates list query → toast success

**Search:** debounced 300ms input → triggers new API call with `search` param → resets to page 1.

### Per-entity column configs (`src/components/Dashboard/configs/`)

One file per entity exporting the `EntityListConfig`. Representative columns:

| Entity | Columns |
|--------|---------|
| Player | Avatar + Full name, Position, Active, Created |
| Team | Logo + Name, Short name, City, Created |
| Coach | Avatar + Full name, Active, Created |
| Referee | Avatar + Full name, Created |
| Staff | Avatar + Full name, Created |
| Game | Home team vs Away team, Season, Competition, Date |
| Venue | Name, City, Created |
| Competition | Name, Short name, Created |
| Player Stats | Player name, Team, Game (home vs away), Points |
| Team Stats | Team, Game (home vs away), Coach |

### Form page consolidation (`src/components/Dashboard/{Entity}/`)

Each entity: `CreateX.tsx` + `EditX.tsx` → `XFormPage.tsx`

```tsx
// XFormPage.tsx — pattern for all 10 entities
const { id } = useParams()
const mode = id ? 'edit' : 'create'
const { data: entity } = useQuery({ ..., enabled: !!id })
const mutation = useMutation({ mutationFn: id ? updateX : createX, ... })
return <XForm mode={mode} defaultValues={entity} onSubmit={mutation.mutate} isSuccess={mutation.isSuccess} />
```

`XForm` (Provider + Content + Fields) is **not modified**. Reset logic stays exactly as-is.

The `DashboardList` preview panel (recent items shown on create pages) is removed — the list page replaces this.

### Data fetching — `useAdminList` hook (`src/hooks/queries/dashboard/UseAdminList.ts`)

Generic hook wrapping the dashboard API call:

```ts
useAdminList({ entityType, page, pageSize, search, sort, direction })
// returns: { data, total, isLoading, isError }
```

---

## Backend changes

### Dashboard service (`backend/src/api/dashboard/services/dashboard.ts`)

Each `find*` method gains `page`, `pageSize`, `search` params. Return shape changes from array to:

```ts
{ data: T[], meta: { total: number, page: number, pageSize: number } }
```

Search field per entity:
- `last_name` — player, coach, referee, staff
- `name` — team, venue, competition
- `season` — game, player-stats, team-stats

Pagination via Strapi `db.query().findMany({ limit, offset, where })` + `.count({ where })`.

### Dashboard controller (`backend/src/api/dashboard/controllers/dashboard.ts`)

Each handler reads `page`, `pageSize`, `search` from `ctx.query` and passes them to the service.

### Delete

No new backend route needed. Standard Strapi REST `DELETE /api/{entity}/:id` already exists and is protected by `require-auth-for-writes`. Frontend adds `API_ROUTES.delete.*` entries (same URL pattern as `API_ROUTES.edit.*`) and per-entity delete service files.

---

## Dependencies

### shadcn/ui

```bash
npx shadcn@latest init    # Tailwind v4 already installed
npx shadcn@latest add button input table alert-dialog badge
```

Used only for new dashboard list components. Existing non-dashboard components are not replaced.

### react-select

```bash
npm install react-select @types/react-select
```

Replaces native `<select>` elements inside form field components (position, nationality, competition type, etc.). Existing Radix `Select` usage outside forms stays.

---

## Route constants (`src/constants/Routes.ts`)

New entries needed:
- `APP_ROUTES.dashboard.{entity}.list` for each entity
- Update `APP_ROUTES.dashboard.{entity}.edit` to include `:id` in the path
- `API_ROUTES.delete.*` matching the pattern of `API_ROUTES.edit.*`

---

## Verification

1. `make dev` — start the full stack
2. Navigate to `/dashboard` — should land on `/dashboard/player/list`
3. Sidebar labels navigate to their respective list pages; active state highlights correctly
4. List page loads 20 items, pagination works (prev/next, page count)
5. Search: type a name, results update server-side after debounce
6. Click "Create new Player" → navigates to `/dashboard/player/create`, form works, submits, resets
7. Click Edit on a row → navigates to `/dashboard/player/edit/:id`, form pre-fills, updates on submit
8. Click Delete → confirmation dialog appears → confirm → item removed, list refreshes
9. Run `cd frontend && npm run build` — no TypeScript errors
