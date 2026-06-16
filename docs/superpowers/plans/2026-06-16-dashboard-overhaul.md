# Dashboard Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current per-entity create/edit-only dashboard with a paginated list view per entity, pure-nav sidebar, consolidated form pages, shadcn UI, and server-side search/delete.

**Architecture:** New `/api/dashboard/admin/{entity}` backend endpoints serve paginated + searchable lists without touching existing dashboard endpoints (preserving all consumers). A single generic `EntityListPage` component is driven by per-entity configs. Each entity's two wrapper components (CreateX / EditX) collapse into one `XFormPage` that reads mode from the URL param.

**Tech Stack:** Strapi 5 (backend), React + Vite + TanStack Query v5, shadcn/ui, Tailwind CSS v4 (already installed), react-select (already installed), lucide-react, react-hot-toast.

---

## File Structure

### Backend — modified
- `backend/src/api/dashboard/services/dashboard.ts` — add `findXAdmin` paginated+search methods
- `backend/src/api/dashboard/controllers/dashboard.ts` — add `getXAdmin` handlers
- `backend/src/api/dashboard/routes/dashboard.ts` — add `/dashboard/admin/{entity}` routes

### Frontend — new
- `frontend/src/components/Dashboard/EntityListPage/types.ts`
- `frontend/src/components/Dashboard/EntityListPage/EntityListPage.tsx`
- `frontend/src/hooks/queries/dashboard/UseAdminList.ts`
- `frontend/src/hooks/queries/player-stats/UsePlayerStatById.ts`
- `frontend/src/hooks/queries/team-stats/UseTeamStatById.ts`
- `frontend/src/components/Dashboard/configs/playerListConfig.tsx`
- `frontend/src/components/Dashboard/configs/teamListConfig.tsx`
- `frontend/src/components/Dashboard/configs/coachListConfig.tsx`
- `frontend/src/components/Dashboard/configs/refereeListConfig.tsx`
- `frontend/src/components/Dashboard/configs/staffListConfig.tsx`
- `frontend/src/components/Dashboard/configs/gameListConfig.tsx`
- `frontend/src/components/Dashboard/configs/venueListConfig.tsx`
- `frontend/src/components/Dashboard/configs/competitionListConfig.tsx`
- `frontend/src/components/Dashboard/configs/playerStatsListConfig.tsx`
- `frontend/src/components/Dashboard/configs/teamStatsListConfig.tsx`
- `frontend/src/services/players/DeletePlayer.ts`
- `frontend/src/services/teams/DeleteTeam.ts`
- `frontend/src/services/coaches/DeleteCoach.ts`
- `frontend/src/services/referees/DeleteReferee.ts`
- `frontend/src/services/staff/DeleteStaff.ts`
- `frontend/src/services/games/DeleteGame.ts`
- `frontend/src/services/venue/DeleteVenue.ts`
- `frontend/src/services/competitions/DeleteCompetition.ts`
- `frontend/src/services/player-stats/DeletePlayerStats.ts`
- `frontend/src/services/team-stats/DeleteTeamStats.ts`
- `frontend/src/components/Dashboard/Player/PlayerFormPage.tsx`
- `frontend/src/components/Dashboard/Team/TeamFormPage.tsx`
- `frontend/src/components/Dashboard/Coach/CoachFormPage.tsx`
- `frontend/src/components/Dashboard/Referee/RefereeFormPage.tsx`
- `frontend/src/components/Dashboard/Staff/StaffFormPage.tsx`
- `frontend/src/components/Dashboard/Game/GameFormPage.tsx`
- `frontend/src/components/Dashboard/Venue/VenueFormPage.tsx`
- `frontend/src/components/Dashboard/Competition/CompetitionFormPage.tsx`
- `frontend/src/components/Dashboard/PlayerStats/PlayerStatsFormPage.tsx`
- `frontend/src/components/Dashboard/TeamStats/TeamStatsFormPage.tsx`

### Frontend — modified
- `frontend/src/constants/Routes.ts`
- `frontend/src/routes/DashboardRoutes.tsx`
- `frontend/src/components/Sidebar/DashboardSidebarRow.tsx`
- `frontend/src/components/Dashboard/Dashboard.tsx`

### Frontend — deleted
- `frontend/src/components/Dashboard/Player/CreatePlayer.tsx`
- `frontend/src/components/Dashboard/Player/EditPlayer.tsx`
- `frontend/src/components/Dashboard/Team/CreateTeam.tsx`
- `frontend/src/components/Dashboard/Team/EditTeam.tsx`
- `frontend/src/components/Dashboard/Coach/CreateCoach.tsx`
- `frontend/src/components/Dashboard/Coach/EditCoach.tsx`
- `frontend/src/components/Dashboard/Referee/CreateReferee.tsx`
- `frontend/src/components/Dashboard/Referee/EditReferee.tsx`
- `frontend/src/components/Dashboard/Staff/CreateStaff.tsx`
- `frontend/src/components/Dashboard/Staff/EditStaff.tsx`
- `frontend/src/components/Dashboard/Game/CreateGame.tsx`
- `frontend/src/components/Dashboard/Game/EditGame.tsx`
- `frontend/src/components/Dashboard/Venue/CreateVenue.tsx`
- `frontend/src/components/Dashboard/Venue/EditVenue.tsx`
- `frontend/src/components/Dashboard/Competition/CreateCompetition.tsx`
- `frontend/src/components/Dashboard/Competition/EditCompetition.tsx`
- `frontend/src/components/Dashboard/PlayerStats/CreatePlayerStats.tsx`
- `frontend/src/components/Dashboard/PlayerStats/EditPlayerStats.tsx`
- `frontend/src/components/Dashboard/TeamStats/CreateTeamStats.tsx`
- `frontend/src/components/Dashboard/TeamStats/EditTeamStats.tsx`

---

## Task 1: Install shadcn/ui

**Files:**
- Modify: `frontend/package.json` (via CLI)
- Create: `frontend/src/components/ui/` (shadcn generates these)

- [ ] **Step 1: Init shadcn**

```bash
cd frontend && npx shadcn@latest init --defaults
```

If prompted: style = **New York**, base color = **Slate**, CSS variables = **yes**.

- [ ] **Step 2: Add required components**

```bash
cd frontend && npx shadcn@latest add button input table alert-dialog badge
```

- [ ] **Step 3: Verify components were created**

```bash
ls frontend/src/components/ui/
```
Expected: `button.tsx`, `input.tsx`, `table.tsx`, `alert-dialog.tsx`, `badge.tsx` (plus any auto-added dependencies).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ui/ frontend/components.json frontend/src/lib/utils.ts frontend/package.json frontend/package-lock.json
git commit -m "feat: install shadcn/ui with button, input, table, alert-dialog, badge"
```

---

## Task 2: Backend — admin list service methods

**Files:**
- Modify: `backend/src/api/dashboard/services/dashboard.ts`

- [ ] **Step 1: Add `DashboardAdminParams` type and all admin find methods**

Add the following to `backend/src/api/dashboard/services/dashboard.ts` after the existing exports (inside the exported factory function, after `findStaff`):

```ts
interface DashboardAdminParams {
  sort?: string;
  direction?: string;
  page?: number | string;
  pageSize?: number | string;
  search?: string;
}

interface AdminListResult<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}

async findPlayersAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { last_name: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::player.player").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::player.player").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findCoachesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { last_name: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::coach.coach").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::coach.coach").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findRefereesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { last_name: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::referee.referee").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::referee.referee").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findStaffAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { last_name: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::staff.staff").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::staff.staff").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findTeamsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { name: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::team.team").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::team.team").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findVenuesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { name: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::venue.venue").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::venue.venue").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findCompetitionsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { name: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::competition.competition").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::competition.competition").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findGamesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { season: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::game.game").findMany({
      select: ["*"],
      populate: ["home_team", "away_team"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::game.game").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findPlayerStatsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  // search on season (direct field) — relation search not supported here
  const where = search ? { season: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::player-stats.player-stat").findMany({
      select: ["*"],
      populate: ["player", "team", "game", "game.home_team", "game.away_team"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::player-stats.player-stat").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},

async findTeamStatsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: DashboardAdminParams): Promise<AdminListResult<unknown>> {
  const where = search ? { season: { $contains: search } } : {};
  const offset = (Number(page) - 1) * Number(pageSize);
  const [data, total] = await Promise.all([
    strapi.db.query("api::team-stats.team-stat").findMany({
      select: ["*"],
      populate: ["game", "game.home_team", "game.away_team", "coach", "team"],
      orderBy: { [sort]: direction },
      where,
      limit: Number(pageSize),
      offset,
    }),
    strapi.db.query("api::team-stats.team-stat").count({ where }),
  ]);
  return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
},
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/api/dashboard/services/dashboard.ts
git commit -m "feat: add paginated admin list methods to dashboard service"
```

---

## Task 3: Backend — admin list controller + routes

**Files:**
- Modify: `backend/src/api/dashboard/controllers/dashboard.ts`
- Modify: `backend/src/api/dashboard/routes/dashboard.ts`

- [ ] **Step 1: Add controller handlers**

Add the following inside the exported factory function in `backend/src/api/dashboard/controllers/dashboard.ts`, after the existing `getStaff` handler:

```ts
async getPlayersAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findPlayersAdmin({ sort, direction, page, pageSize, search });
},

async getCoachesAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findCoachesAdmin({ sort, direction, page, pageSize, search });
},

async getRefereesAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findRefereesAdmin({ sort, direction, page, pageSize, search });
},

async getStaffAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findStaffAdmin({ sort, direction, page, pageSize, search });
},

async getTeamsAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findTeamsAdmin({ sort, direction, page, pageSize, search });
},

async getVenuesAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findVenuesAdmin({ sort, direction, page, pageSize, search });
},

async getCompetitionsAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findCompetitionsAdmin({ sort, direction, page, pageSize, search });
},

async getGamesAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findGamesAdmin({ sort, direction, page, pageSize, search });
},

async getPlayerStatsAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findPlayerStatsAdmin({ sort, direction, page, pageSize, search });
},

async getTeamStatsAdmin(ctx: Context) {
  const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
  const service = strapi.service("api::dashboard.dashboard");
  ctx.body = await service.findTeamStatsAdmin({ sort, direction, page, pageSize, search });
},
```

- [ ] **Step 2: Add routes**

Add the following entries inside the `routes` array in `backend/src/api/dashboard/routes/dashboard.ts`, after the existing `/dashboard/staff` route:

```ts
{
  method: "GET",
  path: "/dashboard/admin/players",
  handler: "dashboard.getPlayersAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/coaches",
  handler: "dashboard.getCoachesAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/referees",
  handler: "dashboard.getRefereesAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/staff",
  handler: "dashboard.getStaffAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/teams",
  handler: "dashboard.getTeamsAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/venues",
  handler: "dashboard.getVenuesAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/competitions",
  handler: "dashboard.getCompetitionsAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/games",
  handler: "dashboard.getGamesAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/player-stats",
  handler: "dashboard.getPlayerStatsAdmin",
  config: { auth: false },
},
{
  method: "GET",
  path: "/dashboard/admin/team-stats",
  handler: "dashboard.getTeamStatsAdmin",
  config: { auth: false },
},
```

- [ ] **Step 3: Start backend and smoke-test one endpoint**

```bash
make dev-logs-backend
# In another terminal:
curl "http://localhost:1337/api/dashboard/admin/players?page=1&pageSize=3" | python3 -m json.tool
```

Expected: `{ "data": [...], "meta": { "total": N, "page": 1, "pageSize": 3 } }`

- [ ] **Step 4: Commit**

```bash
git add backend/src/api/dashboard/controllers/dashboard.ts backend/src/api/dashboard/routes/dashboard.ts
git commit -m "feat: add admin list controller handlers and routes with pagination + search"
```

---

## Task 4: Frontend — update Routes.ts

**Files:**
- Modify: `frontend/src/constants/Routes.ts`

- [ ] **Step 1: Add `adminList` and `delete` sections to `API_ROUTES`, add `list` paths and update `edit` paths in `APP_ROUTES`**

Inside `API_ROUTES`, add after the `dashboard` block:

```ts
adminList: {
  players: (params: string) => `${root}/dashboard/admin/players?${params}`,
  coaches: (params: string) => `${root}/dashboard/admin/coaches?${params}`,
  referees: (params: string) => `${root}/dashboard/admin/referees?${params}`,
  staff: (params: string) => `${root}/dashboard/admin/staff?${params}`,
  teams: (params: string) => `${root}/dashboard/admin/teams?${params}`,
  venues: (params: string) => `${root}/dashboard/admin/venues?${params}`,
  competitions: (params: string) => `${root}/dashboard/admin/competitions?${params}`,
  games: (params: string) => `${root}/dashboard/admin/games?${params}`,
  playerStats: (params: string) => `${root}/dashboard/admin/player-stats?${params}`,
  teamStats: (params: string) => `${root}/dashboard/admin/team-stats?${params}`,
},
delete: {
  player: (id: string) => `${root}/players/${id}`,
  referee: (id: string) => `${root}/referees/${id}`,
  team: (id: string) => `${root}/teams/${id}`,
  coach: (id: string) => `${root}/coaches/${id}`,
  staff: (id: string) => `${root}/staffs/${id}`,
  game: (id: string) => `${root}/games/${id}`,
  venue: (id: string) => `${root}/venues/${id}`,
  competition: (id: string) => `${root}/competitions/${id}`,
  playerStats: (id: string) => `${root}/player-stats/${id}`,
  teamStats: (id: string) => `${root}/team-stats/${id}`,
},
```

Replace the entire `APP_ROUTES.dashboard` block with:

```ts
dashboard: {
  default: '/dashboard',
  player: {
    list: '/dashboard/player/list',
    create: '/dashboard/player/create',
    edit: '/dashboard/player/edit/',
  },
  staff: {
    list: '/dashboard/staff/list',
    create: '/dashboard/staff/create',
    edit: '/dashboard/staff/edit/',
  },
  team: {
    list: '/dashboard/team/list',
    create: '/dashboard/team/create',
    edit: '/dashboard/team/edit/',
  },
  referee: {
    list: '/dashboard/referee/list',
    create: '/dashboard/referee/create',
    edit: '/dashboard/referee/edit/',
  },
  coach: {
    list: '/dashboard/coach/list',
    create: '/dashboard/coach/create',
    edit: '/dashboard/coach/edit/',
  },
  game: {
    list: '/dashboard/game/list',
    create: '/dashboard/game/create',
    edit: '/dashboard/game/edit/',
  },
  venue: {
    list: '/dashboard/venue/list',
    create: '/dashboard/venue/create',
    edit: '/dashboard/venue/edit/',
  },
  competition: {
    list: '/dashboard/competition/list',
    create: '/dashboard/competition/create',
    edit: '/dashboard/competition/edit/',
  },
  playerStats: {
    list: '/dashboard/player-stats/list',
    create: '/dashboard/player-stats/create',
    edit: '/dashboard/player-stats/edit/',
  },
  teamStats: {
    list: '/dashboard/team-stats/list',
    create: '/dashboard/team-stats/create',
    edit: '/dashboard/team-stats/edit/',
  },
},
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd frontend && npx tsc --noEmit 2>&1 | head -30
```

Expected: errors only from files that import old `create`/`edit` paths from the now-changed dashboard routes — these will be fixed in later tasks. Zero errors from `Routes.ts` itself.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/constants/Routes.ts
git commit -m "feat: add adminList + delete API routes, add list paths to APP_ROUTES dashboard"
```

---

## Task 5: Frontend — update DashboardRoutes.tsx

**Files:**
- Modify: `frontend/src/routes/DashboardRoutes.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import Dashboard from '@/components/Dashboard/Dashboard';
import CoachFormPage from '@/components/Dashboard/Coach/CoachFormPage';
import CompetitionFormPage from '@/components/Dashboard/Competition/CompetitionFormPage';
import GameFormPage from '@/components/Dashboard/Game/GameFormPage';
import PlayerFormPage from '@/components/Dashboard/Player/PlayerFormPage';
import PlayerStatsFormPage from '@/components/Dashboard/PlayerStats/PlayerStatsFormPage';
import RefereeFormPage from '@/components/Dashboard/Referee/RefereeFormPage';
import StaffFormPage from '@/components/Dashboard/Staff/StaffFormPage';
import TeamFormPage from '@/components/Dashboard/Team/TeamFormPage';
import TeamStatsFormPage from '@/components/Dashboard/TeamStats/TeamStatsFormPage';
import VenueFormPage from '@/components/Dashboard/Venue/VenueFormPage';
import { EntityListPage } from '@/components/Dashboard/EntityListPage/EntityListPage';
import { playerListConfig } from '@/components/Dashboard/configs/playerListConfig';
import { teamListConfig } from '@/components/Dashboard/configs/teamListConfig';
import { coachListConfig } from '@/components/Dashboard/configs/coachListConfig';
import { refereeListConfig } from '@/components/Dashboard/configs/refereeListConfig';
import { staffListConfig } from '@/components/Dashboard/configs/staffListConfig';
import { gameListConfig } from '@/components/Dashboard/configs/gameListConfig';
import { venueListConfig } from '@/components/Dashboard/configs/venueListConfig';
import { competitionListConfig } from '@/components/Dashboard/configs/competitionListConfig';
import { playerStatsListConfig } from '@/components/Dashboard/configs/playerStatsListConfig';
import { teamStatsListConfig } from '@/components/Dashboard/configs/teamStatsListConfig';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

export const dashboardRoutes: RouteObject = {
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="player" replace /> },

    {
      path: 'player',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={playerListConfig} /> },
        { path: 'create', element: <PlayerFormPage /> },
        { path: 'edit/:id', element: <PlayerFormPage /> },
      ],
    },

    {
      path: 'coach',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={coachListConfig} /> },
        { path: 'create', element: <CoachFormPage /> },
        { path: 'edit/:id', element: <CoachFormPage /> },
      ],
    },

    {
      path: 'team',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={teamListConfig} /> },
        { path: 'create', element: <TeamFormPage /> },
        { path: 'edit/:id', element: <TeamFormPage /> },
      ],
    },

    {
      path: 'referee',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={refereeListConfig} /> },
        { path: 'create', element: <RefereeFormPage /> },
        { path: 'edit/:id', element: <RefereeFormPage /> },
      ],
    },

    {
      path: 'game',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={gameListConfig} /> },
        { path: 'create', element: <GameFormPage /> },
        { path: 'edit/:id', element: <GameFormPage /> },
      ],
    },

    {
      path: 'venue',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={venueListConfig} /> },
        { path: 'create', element: <VenueFormPage /> },
        { path: 'edit/:id', element: <VenueFormPage /> },
      ],
    },

    {
      path: 'competition',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={competitionListConfig} /> },
        { path: 'create', element: <CompetitionFormPage /> },
        { path: 'edit/:id', element: <CompetitionFormPage /> },
      ],
    },

    {
      path: 'player-stats',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={playerStatsListConfig} /> },
        { path: 'create', element: <PlayerStatsFormPage /> },
        { path: 'edit/:id', element: <PlayerStatsFormPage /> },
      ],
    },

    {
      path: 'staff',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={staffListConfig} /> },
        { path: 'create', element: <StaffFormPage /> },
        { path: 'edit/:id', element: <StaffFormPage /> },
      ],
    },

    {
      path: 'team-stats',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={teamStatsListConfig} /> },
        { path: 'create', element: <TeamStatsFormPage /> },
        { path: 'edit/:id', element: <TeamStatsFormPage /> },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/routes/DashboardRoutes.tsx
git commit -m "feat: add list routes and edit/:id to dashboard route tree"
```

---

## Task 6: Frontend — sidebar pure navigation

**Files:**
- Modify: `frontend/src/components/Sidebar/DashboardSidebarRow.tsx`
- Modify: `frontend/src/components/Dashboard/Dashboard.tsx`

- [ ] **Step 1: Replace DashboardSidebarRow.tsx**

```tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './DashboardSidebar.module.css';

export type DashboardNavItem = {
  label: string;
  listPath: string;
};

const DashboardSidebarRow: React.FC<DashboardNavItem> = ({ label, listPath }) => {
  return (
    <li>
      <NavLink
        to={listPath}
        className={({ isActive }) =>
          `${styles.row} ${isActive ? styles.rowActive : ''}`
        }
        end={false}
      >
        {label}
      </NavLink>
    </li>
  );
};

export default DashboardSidebarRow;
```

- [ ] **Step 2: Add `rowActive` to `DashboardSidebar.module.css`**

Open `frontend/src/components/Sidebar/DashboardSidebar.module.css` and add (if `rowActive` doesn't exist):

```css
.rowActive {
  background-color: #1e3a5f;
  color: #93c5fd;
  border-left: 2px solid #3b82f6;
  font-weight: 600;
}
```

Also ensure `.row` has a base style (copy from existing if it already has one). The row is now a full `<a>` element so remove any `display:flex` row action patterns if they were in `.row`.

- [ ] **Step 3: Update Dashboard.tsx**

Replace the `navItems` / `statsItems` arrays and the mobile `options` logic:

```tsx
const navItems: DashboardNavItem[] = [
  { label: 'Player', listPath: APP_ROUTES.dashboard.player.list },
  { label: 'Staff', listPath: APP_ROUTES.dashboard.staff.list },
  { label: 'Referee', listPath: APP_ROUTES.dashboard.referee.list },
  { label: 'Team', listPath: APP_ROUTES.dashboard.team.list },
  { label: 'Coach', listPath: APP_ROUTES.dashboard.coach.list },
  { label: 'Game', listPath: APP_ROUTES.dashboard.game.list },
  { label: 'Venue', listPath: APP_ROUTES.dashboard.venue.list },
  { label: 'Competition', listPath: APP_ROUTES.dashboard.competition.list },
];

const statsItems: DashboardNavItem[] = [
  { label: 'Player Stats', listPath: APP_ROUTES.dashboard.playerStats.list },
  { label: 'Team Stats', listPath: APP_ROUTES.dashboard.teamStats.list },
];
```

Replace the `options` useMemo:

```ts
const options: Option[] = useMemo(() => {
  return [...navItems, ...statsItems].map((item) => ({
    value: item.listPath,
    label: item.label,
  }));
}, []);
```

Replace `currentOption`:

```ts
const currentOption: Option | null =
  options.find((o) => location.pathname.startsWith(o.value.replace('/list', ''))) || null;
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Sidebar/DashboardSidebarRow.tsx \
        frontend/src/components/Sidebar/DashboardSidebar.module.css \
        frontend/src/components/Dashboard/Dashboard.tsx
git commit -m "feat: sidebar becomes pure nav labels linking to list pages"
```

---

## Task 7: Frontend — EntityListPage types and useAdminList hook

**Files:**
- Create: `frontend/src/components/Dashboard/EntityListPage/types.ts`
- Create: `frontend/src/hooks/queries/dashboard/UseAdminList.ts`

- [ ] **Step 1: Create types.ts**

```ts
// frontend/src/components/Dashboard/EntityListPage/types.ts
import { ReactNode } from 'react';

export interface AdminColumnDef<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export interface AdminListResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}

export interface EntityListConfig<T extends { documentId: string }> {
  title: string;
  entityType: string;
  apiRoute: (params: string) => string;
  columns: AdminColumnDef<T>[];
  searchPlaceholder: string;
  createPath: string;
  editPath: (id: string) => string;
  deleteApiRoute: (id: string) => string;
  deleteLabel: (row: T) => string;
}
```

- [ ] **Step 2: Create UseAdminList.ts**

```ts
// frontend/src/hooks/queries/dashboard/UseAdminList.ts
import apiClient from '@/lib/ApiClient';
import { useQuery } from '@/hooks/UseQueryWithToast';
import { AdminListResponse } from '@/components/Dashboard/EntityListPage/types';

interface UseAdminListParams {
  apiRoute: (params: string) => string;
  entityType: string;
  page: number;
  pageSize: number;
  search: string;
}

export function useAdminList<T>({
  apiRoute,
  entityType,
  page,
  pageSize,
  search,
}: UseAdminListParams) {
  return useQuery<AdminListResponse<T>>({
    queryKey: [entityType, 'admin-list', page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
        sort: 'createdAt',
        direction: 'desc',
      });
      const res = await apiClient.get(apiRoute(params.toString()));
      return res.data;
    },
    errorMessage: `Failed to load ${entityType} list`,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Dashboard/EntityListPage/types.ts \
        frontend/src/hooks/queries/dashboard/UseAdminList.ts
git commit -m "feat: add EntityListConfig types and useAdminList hook"
```

---

## Task 8: Frontend — EntityListPage generic component

**Files:**
- Create: `frontend/src/components/Dashboard/EntityListPage/EntityListPage.tsx`

- [ ] **Step 1: Create EntityListPage.tsx**

```tsx
// frontend/src/components/Dashboard/EntityListPage/EntityListPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

import apiClient from '@/lib/ApiClient';
import { useAdminList } from '@/hooks/queries/dashboard/UseAdminList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EntityListConfig } from './types';

const PAGE_SIZE = 20;

interface EntityListPageProps<T extends { documentId: string }> {
  config: EntityListConfig<T>;
}

export function EntityListPage<T extends { documentId: string }>({
  config,
}: EntityListPageProps<T>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useAdminList<T>({
    apiRoute: config.apiRoute,
    entityType: config.entityType,
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
  });

  const deleteMutation = useMutation({
    mutationFn: (row: T) => apiClient.delete(config.deleteApiRoute(row.documentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.entityType, 'admin-list'] });
      toast.success('Deleted successfully');
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast.error(`Delete failed: ${err.message}`);
      setDeleteTarget(null);
    },
  });

  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">{config.title}</h1>
          <p className="text-sm text-slate-500">{total} total</p>
        </div>
        <Button onClick={() => navigate(config.createPath)}>
          + Create new {config.title.replace(/s$/, '')}
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder={config.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-2 text-sm text-slate-400 whitespace-nowrap">
          <span className="text-slate-500">Showing {from}–{to} of {total}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            ← Prev
          </Button>
          <span className="font-semibold text-slate-200">{page} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            {config.columns.map((col) => (
              <TableHead key={col.header} className={col.className}>
                {col.header}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={config.columns.length + 2} className="text-center text-slate-500 py-8">
                Loading...
              </TableCell>
            </TableRow>
          )}
          {!isLoading && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={config.columns.length + 2} className="text-center text-slate-500 py-8">
                No results
              </TableCell>
            </TableRow>
          )}
          {items.map((row, idx) => (
            <TableRow key={row.documentId}>
              <TableCell className="text-slate-500 text-sm">{from + idx}</TableCell>
              {config.columns.map((col) => (
                <TableCell key={col.header} className={col.className}>
                  {col.cell(row)}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(config.editPath(row.documentId))}
                  >
                    <Pencil size={13} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(row)}
                  >
                    <Trash2 size={13} className="mr-1" /> Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget ? config.deleteLabel(deleteTarget) : ''}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Dashboard/EntityListPage/EntityListPage.tsx
git commit -m "feat: generic EntityListPage component with search, pagination, and delete dialog"
```

---

## Task 9: Frontend — per-entity list configs

**Files:**
- Create: `frontend/src/components/Dashboard/configs/playerListConfig.tsx` (and 9 more)

- [ ] **Step 1: Create all 10 config files**

**`frontend/src/components/Dashboard/configs/playerListConfig.tsx`**
```tsx
import { PlayerResponse } from '@/types/api/Player';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const playerListConfig: EntityListConfig<PlayerResponse> = {
  title: 'Players',
  entityType: 'player',
  apiRoute: API_ROUTES.adminList.players,
  searchPlaceholder: 'Search by last name...',
  createPath: APP_ROUTES.dashboard.player.create,
  editPath: (id) => `${APP_ROUTES.dashboard.player.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.player,
  deleteLabel: (row) => `${row.first_name} ${row.last_name}`,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image
            ? <img src={row.image.url} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded-full bg-slate-700 flex-shrink-0" />}
          <span className="font-medium">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    {
      header: 'Position',
      cell: (row) => row.primary_position ?? '—',
      className: 'text-slate-400',
    },
    {
      header: 'Active',
      cell: (row) => (row.is_active_player ? 'Yes' : 'No'),
      className: 'text-slate-400',
    },
    {
      header: 'Created',
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
      className: 'text-slate-400 text-sm',
    },
  ],
};
```

**`frontend/src/components/Dashboard/configs/teamListConfig.tsx`**
```tsx
import { TeamDetailsResponse } from '@/types/api/Team';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const teamListConfig: EntityListConfig<TeamDetailsResponse> = {
  title: 'Teams',
  entityType: 'team',
  apiRoute: API_ROUTES.adminList.teams,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.team.create,
  editPath: (id) => `${APP_ROUTES.dashboard.team.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.team,
  deleteLabel: (row) => row.name,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image
            ? <img src={row.image.url} className="w-7 h-7 rounded object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded bg-slate-700 flex-shrink-0" />}
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: 'Short', cell: (row) => row.short_name ?? '—', className: 'text-slate-400' },
    { header: 'City', cell: (row) => row.city ?? '—', className: 'text-slate-400' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-slate-400 text-sm' },
  ],
};
```

**`frontend/src/components/Dashboard/configs/coachListConfig.tsx`**
```tsx
import { CoachResponse } from '@/types/api/Coach';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const coachListConfig: EntityListConfig<CoachResponse> = {
  title: 'Coaches',
  entityType: 'coach',
  apiRoute: API_ROUTES.adminList.coaches,
  searchPlaceholder: 'Search by last name...',
  createPath: APP_ROUTES.dashboard.coach.create,
  editPath: (id) => `${APP_ROUTES.dashboard.coach.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.coach,
  deleteLabel: (row) => `${row.first_name} ${row.last_name}`,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image
            ? <img src={row.image.url} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded-full bg-slate-700 flex-shrink-0" />}
          <span className="font-medium">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    { header: 'Active', cell: (row) => (row.is_active ? 'Yes' : 'No'), className: 'text-slate-400' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-slate-400 text-sm' },
  ],
};
```

**`frontend/src/components/Dashboard/configs/refereeListConfig.tsx`**
```tsx
import { RefereeDetailsResponse } from '@/types/api/Referee';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const refereeListConfig: EntityListConfig<RefereeDetailsResponse> = {
  title: 'Referees',
  entityType: 'referee',
  apiRoute: API_ROUTES.adminList.referees,
  searchPlaceholder: 'Search by last name...',
  createPath: APP_ROUTES.dashboard.referee.create,
  editPath: (id) => `${APP_ROUTES.dashboard.referee.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.referee,
  deleteLabel: (row) => `${row.first_name} ${row.last_name}`,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image
            ? <img src={row.image.url} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded-full bg-slate-700 flex-shrink-0" />}
          <span className="font-medium">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-slate-400 text-sm' },
  ],
};
```

**`frontend/src/components/Dashboard/configs/staffListConfig.tsx`**
```tsx
import { StaffDetailsResponse } from '@/types/api/Staff';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const staffListConfig: EntityListConfig<StaffDetailsResponse> = {
  title: 'Staff',
  entityType: 'staff',
  apiRoute: API_ROUTES.adminList.staff,
  searchPlaceholder: 'Search by last name...',
  createPath: APP_ROUTES.dashboard.staff.create,
  editPath: (id) => `${APP_ROUTES.dashboard.staff.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.staff,
  deleteLabel: (row) => `${row.first_name} ${row.last_name}`,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image
            ? <img src={row.image.url} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded-full bg-slate-700 flex-shrink-0" />}
          <span className="font-medium">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-slate-400 text-sm' },
  ],
};
```

**`frontend/src/components/Dashboard/configs/gameListConfig.tsx`**
```tsx
import { GameDetailsResponse } from '@/types/api/Game';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const gameListConfig: EntityListConfig<GameDetailsResponse> = {
  title: 'Games',
  entityType: 'game',
  apiRoute: API_ROUTES.adminList.games,
  searchPlaceholder: 'Search by season...',
  createPath: APP_ROUTES.dashboard.game.create,
  editPath: (id) => `${APP_ROUTES.dashboard.game.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.game,
  deleteLabel: (row) => `${row.home_team_name} vs ${row.away_team_name} (${row.season})`,
  columns: [
    {
      header: 'Match',
      cell: (row) => (
        <span className="font-medium">{row.home_team_name} vs {row.away_team_name}</span>
      ),
    },
    { header: 'Season', cell: (row) => row.season, className: 'text-slate-400' },
    { header: 'Round', cell: (row) => row.round ?? '—', className: 'text-slate-400' },
    { header: 'Date', cell: (row) => row.date ? new Date(row.date).toLocaleDateString() : '—', className: 'text-slate-400 text-sm' },
  ],
};
```

**`frontend/src/components/Dashboard/configs/venueListConfig.tsx`**
```tsx
import { VenueDetailsResponse } from '@/types/api/Venue';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const venueListConfig: EntityListConfig<VenueDetailsResponse> = {
  title: 'Venues',
  entityType: 'venue',
  apiRoute: API_ROUTES.adminList.venues,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.venue.create,
  editPath: (id) => `${APP_ROUTES.dashboard.venue.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.venue,
  deleteLabel: (row) => row.name,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image
            ? <img src={row.image.url} className="w-7 h-7 rounded object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded bg-slate-700 flex-shrink-0" />}
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: 'City', cell: (row) => row.city ?? '—', className: 'text-slate-400' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-slate-400 text-sm' },
  ],
};
```

**`frontend/src/components/Dashboard/configs/competitionListConfig.tsx`**
```tsx
import { CompetitionDetailsResponse } from '@/types/api/Competition';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const competitionListConfig: EntityListConfig<CompetitionDetailsResponse> = {
  title: 'Competitions',
  entityType: 'competition',
  apiRoute: API_ROUTES.adminList.competitions,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.competition.create,
  editPath: (id) => `${APP_ROUTES.dashboard.competition.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.competition,
  deleteLabel: (row) => row.name,
  columns: [
    {
      header: 'Name',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    { header: 'Short', cell: (row) => row.short_name ?? '—', className: 'text-slate-400' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-slate-400 text-sm' },
  ],
};
```

**`frontend/src/components/Dashboard/configs/playerStatsListConfig.tsx`**
```tsx
import { PlayerStatsResponse } from '@/types/api/PlayerStats';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const playerStatsListConfig: EntityListConfig<PlayerStatsResponse> = {
  title: 'Player Stats',
  entityType: 'player-stats',
  apiRoute: API_ROUTES.adminList.playerStats,
  searchPlaceholder: 'Search by season...',
  createPath: APP_ROUTES.dashboard.playerStats.create,
  editPath: (id) => `${APP_ROUTES.dashboard.playerStats.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.playerStats,
  deleteLabel: (row) =>
    `${row.player?.first_name ?? ''} ${row.player?.last_name ?? ''} — ${row.game?.home_team?.name ?? ''} vs ${row.game?.away_team?.name ?? ''}`,
  columns: [
    {
      header: 'Player',
      cell: (row) => (
        <span className="font-medium">
          {row.player?.first_name} {row.player?.last_name}
        </span>
      ),
    },
    { header: 'Team', cell: (row) => row.team?.name ?? '—', className: 'text-slate-400' },
    {
      header: 'Game',
      cell: (row) =>
        row.game ? `${row.game.home_team_name} vs ${row.game.away_team_name}` : '—',
      className: 'text-slate-400 text-sm',
    },
    { header: 'Pts', cell: (row) => row.points ?? '—', className: 'text-slate-400' },
    { header: 'Status', cell: (row) => row.status, className: 'text-slate-400 text-sm' },
  ],
};
```

**`frontend/src/components/Dashboard/configs/teamStatsListConfig.tsx`**
```tsx
import { TeamStatsResponse } from '@/types/api/TeamStats';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const teamStatsListConfig: EntityListConfig<TeamStatsResponse> = {
  title: 'Team Stats',
  entityType: 'team-stats',
  apiRoute: API_ROUTES.adminList.teamStats,
  searchPlaceholder: 'Search by season...',
  createPath: APP_ROUTES.dashboard.teamStats.create,
  editPath: (id) => `${APP_ROUTES.dashboard.teamStats.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.teamStats,
  deleteLabel: (row) =>
    `${row.team?.name ?? 'Team'} — ${row.game?.home_team_name ?? ''} vs ${row.game?.away_team_name ?? ''}`,
  columns: [
    { header: 'Team', cell: (row) => <span className="font-medium">{row.team?.name ?? '—'}</span> },
    {
      header: 'Game',
      cell: (row) =>
        row.game ? `${row.game.home_team_name} vs ${row.game.away_team_name}` : '—',
      className: 'text-slate-400 text-sm',
    },
    { header: 'Coach', cell: (row) => row.coach ? `${row.coach.first_name} ${row.coach.last_name}` : '—', className: 'text-slate-400' },
  ],
};
```

> **Note on types:** If `CoachResponse`, `RefereeDetailsResponse`, `StaffDetailsResponse`, `VenueDetailsResponse`, `CompetitionDetailsResponse`, or `TeamStatsResponse` don't export `createdAt`, `image`, or other fields used above, check `frontend/src/types/api/` and adjust the field names to match. The `image` field on the API response is a `StrapiImage` object with a `url` property.

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Dashboard/configs/
git commit -m "feat: add per-entity list configs for all 10 entity types"
```

---

## Task 10: Frontend — delete services

**Files:**
- Create: `frontend/src/services/players/DeletePlayer.ts` (and 9 more)

- [ ] **Step 1: Create all 10 delete service files**

**`frontend/src/services/players/DeletePlayer.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deletePlayer = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.player(id));
```

**`frontend/src/services/teams/DeleteTeam.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteTeam = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.team(id));
```

**`frontend/src/services/coaches/DeleteCoach.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteCoach = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.coach(id));
```

**`frontend/src/services/referees/DeleteReferee.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteReferee = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.referee(id));
```

**`frontend/src/services/staff/DeleteStaff.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteStaff = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.staff(id));
```

**`frontend/src/services/games/DeleteGame.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteGame = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.game(id));
```

**`frontend/src/services/venue/DeleteVenue.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteVenue = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.venue(id));
```

**`frontend/src/services/competitions/DeleteCompetition.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteCompetition = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.competition(id));
```

**`frontend/src/services/player-stats/DeletePlayerStats.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deletePlayerStats = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.playerStats(id));
```

**`frontend/src/services/team-stats/DeleteTeamStats.ts`**
```ts
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteTeamStats = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.teamStats(id));
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/services/
git commit -m "feat: add delete service for all 10 entity types"
```

---

## Task 11: Frontend — simple form pages (Player, Team, Coach, Referee, Staff, Venue, Competition)

These 7 entities all follow the same pattern: read `id` from URL params, fetch by ID if editing, delegate create/update to the existing service.

**Files:**
- Create: `frontend/src/components/Dashboard/Player/PlayerFormPage.tsx`
- Create: `frontend/src/components/Dashboard/Team/TeamFormPage.tsx`
- Create: `frontend/src/components/Dashboard/Coach/CoachFormPage.tsx`
- Create: `frontend/src/components/Dashboard/Referee/RefereeFormPage.tsx`
- Create: `frontend/src/components/Dashboard/Staff/StaffFormPage.tsx`
- Create: `frontend/src/components/Dashboard/Venue/VenueFormPage.tsx`
- Create: `frontend/src/components/Dashboard/Competition/CompetitionFormPage.tsx`

- [ ] **Step 1: Create PlayerFormPage.tsx**

```tsx
// frontend/src/components/Dashboard/Player/PlayerFormPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import PlayerForm from '@/components/forms/player/PlayerForm';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';
import FormPageLayout from '@/layouts/FormPageLayout';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { createPlayer } from '@/services/players/CreatePlayer';
import { updatePlayer } from '@/services/players/UpdatePlayer';

const PlayerFormPage: React.FC = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const mode = documentId ? 'edit' : 'create';

  const { data: player } = usePlayerDetails(documentId ?? '');

  const mutation = useMutation({
    mutationFn: (data: PlayerFormData) =>
      documentId ? updatePlayer({ ...data, id: documentId }) : createPlayer(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['player', 'admin-list'] });
      toast.success(
        mode === 'create'
          ? `Player ${variables.first_name} ${variables.last_name} created successfully`
          : 'Player updated successfully'
      );
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const defaultValues = player
    ? {
        first_name: player.first_name,
        last_name: player.last_name,
        date_of_birth: player.date_of_birth || undefined,
        date_of_death: player.date_of_death || undefined,
        active_player: player.is_active_player,
        image: player.image ? player.image.id : null,
        nationality: player.nationality,
        primary_position: player.primary_position,
        secondary_position: player.secondary_position,
      }
    : undefined;

  return (
    <FormPageLayout>
      <PlayerForm
        onSubmit={(data) => mutation.mutate(data)}
        mode={mode}
        player={player}
        defaultValues={defaultValues}
        isSuccess={mutation.isSuccess}
      />
      <Toaster position="bottom-right" />
    </FormPageLayout>
  );
};

export default PlayerFormPage;
```

- [ ] **Step 2: Create TeamFormPage.tsx**

Open `frontend/src/components/Dashboard/Team/CreateTeam.tsx` and `EditTeam.tsx` to identify the form component import, services, hooks, and defaultValues mapping. Then create:

```tsx
// frontend/src/components/Dashboard/Team/TeamFormPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import apiClient from '@/lib/ApiClient';
import { useQuery } from '@/hooks/UseQueryWithToast';
import TeamForm from '@/components/forms/team/TeamForm';
import FormPageLayout from '@/layouts/FormPageLayout';
import { API_ROUTES } from '@/constants/Routes';
import { createTeam } from '@/services/teams/CreateTeam';
import { updateTeam } from '@/services/teams/UpdateTeam';
import { TeamResponse } from '@/types/api/Team';

// Inline fetch by documentId using standard Strapi endpoint
const fetchTeamById = async (id: string): Promise<TeamResponse> => {
  const res = await apiClient.get(`${API_ROUTES.edit.team(id)}?populate=*`);
  return res.data.data;
};

const TeamFormPage: React.FC = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const mode = documentId ? 'edit' : 'create';

  const { data: team } = useQuery<TeamResponse>({
    queryKey: ['team-admin', documentId],
    queryFn: () => fetchTeamById(documentId!),
    enabled: !!documentId,
    errorMessage: 'Failed to load team',
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      documentId ? updateTeam({ ...data, id: documentId }) : createTeam(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team', 'admin-list'] });
      toast.success(
        mode === 'create' ? `Team ${variables.name} created successfully` : 'Team updated successfully'
      );
    },
    onError: (error: Error) => toast.error(`Error: ${error.message}`),
  });

  // Copy defaultValues mapping from the existing EditTeam.tsx
  const defaultValues = team ? (() => {
    // Read the current EditTeam.tsx defaultValues block and mirror it here exactly
    // This is intentionally left for the implementor to copy from EditTeam.tsx
    // to avoid drift — open EditTeam.tsx, copy the defaultValues object, paste here.
    return undefined; // replace with actual mapping
  })() : undefined;

  return (
    <FormPageLayout>
      <TeamForm
        onSubmit={(data: any) => mutation.mutate(data)}
        mode={mode}
        team={team}
        defaultValues={defaultValues}
        isSuccess={mutation.isSuccess}
      />
      <Toaster position="bottom-right" />
    </FormPageLayout>
  );
};

export default TeamFormPage;
```

> **Implementation note for Team, Coach, Referee, Staff, Venue, Competition:** The pattern above is identical for each. The key steps are:
> 1. Copy the `defaultValues` mapping from the corresponding `Edit*.tsx` file
> 2. Use the correct `Form` component import (e.g., `CoachForm`, `RefereeForm`)
> 3. Use the correct `create*` and `update*` service imports
> 4. Use the correct entity name in `queryKey` and toast messages
> 5. For Venue and Competition: fetch via inline `apiClient.get(API_ROUTES.edit.venue(id) + '?populate=*')` since their detail hooks use slugs not IDs

Create the remaining 5 form pages following this same pattern:
- `CoachFormPage.tsx` — uses `CoachForm`, `createCoach`, `updateCoach`, `useCoachDetails`
- `RefereeFormPage.tsx` — uses `RefereeForm`, `createReferee`, `updateReferee`, `useRefereeDetails`
- `StaffFormPage.tsx` — uses `StaffForm`, `createStaff`, `updateStaff`, `useStaffDetails`
- `VenueFormPage.tsx` — uses `VenueForm`, `createVenue`, `updateVenue`, inline fetch via `API_ROUTES.edit.venue(id) + '?populate=*'`
- `CompetitionFormPage.tsx` — uses `CompetitionForm`, `createCompetition`, `updateCompetition`, inline fetch via `API_ROUTES.edit.competition(id) + '?populate=*'`

- [ ] **Step 3: Check TypeScript for these files**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep -E "FormPage|configs/" | head -20
```

Fix any type errors before proceeding.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Dashboard/Player/PlayerFormPage.tsx \
        frontend/src/components/Dashboard/Team/TeamFormPage.tsx \
        frontend/src/components/Dashboard/Coach/CoachFormPage.tsx \
        frontend/src/components/Dashboard/Referee/RefereeFormPage.tsx \
        frontend/src/components/Dashboard/Staff/StaffFormPage.tsx \
        frontend/src/components/Dashboard/Venue/VenueFormPage.tsx \
        frontend/src/components/Dashboard/Competition/CompetitionFormPage.tsx
git commit -m "feat: consolidated form pages for player, team, coach, referee, staff, venue, competition"
```

---

## Task 12: Frontend — GameFormPage (replaces CreateGame + EditGame)

**Files:**
- Create: `frontend/src/components/Dashboard/Game/GameFormPage.tsx`

- [ ] **Step 1: Create GameFormPage.tsx**

The key change from `EditGame.tsx`: the three cascading filters (SeasonFilter → CompetitionFilter → GameFilter) are removed. The game is identified by URL param. The `defaultValues` mapping is copied exactly from `EditGame.tsx`.

```tsx
// frontend/src/components/Dashboard/Game/GameFormPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import EditGameWarning from '@/components/forms/game/Form/EditGameWarning';
import GameForm from '@/components/forms/game/GameForm';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import FormPageLayout from '@/layouts/FormPageLayout';
import { GameFormData } from '@/schemas/GameSchema';
import { createGame } from '@/services/games/CreateGame';
import { updateGame } from '@/services/games/UpdateGame';
import { refreshSchedule } from '@/utils/RefreshSchedule';

const GameFormPage: React.FC = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const mode = documentId ? 'edit' : 'create';

  const { data: game } = useGameDetails(documentId ?? '');

  const mutation = useMutation({
    mutationFn: (data: GameFormData) =>
      documentId
        ? updateGame({ ...data, id: documentId })
        : createGame(data),
    onSuccess: async () => {
      if (mode === 'edit') await refreshSchedule();
      queryClient.invalidateQueries({ queryKey: ['game', 'admin-list'] });
      toast.success(mode === 'create' ? 'Game created successfully' : 'Game updated successfully');
    },
    onError: (error: Error) => toast.error(`Error: ${error.message}`),
  });

  const defaultValues = game
    ? {
        season: game.season,
        round: game.round,
        group_name: game.group_name || '',
        date: game.date,
        home_team: game.home_team.id.toString(),
        home_team_name: game.home_team_name,
        home_team_short_name: game.home_team_short_name || game.home_team.short_name,
        away_team: game.away_team.id.toString(),
        away_team_name: game.away_team_name,
        away_team_short_name: game.away_team_short_name || game.away_team.short_name,
        stage: game.stage,
        competition: game.competition.id.toString(),
        league_name: game.league_name,
        league_short_name: game.league_short_name,
        venue: game.venue.id.toString(),
        isNeutral: game.isNeutral,
        isNulled: game.isNulled,
        forfeited: game.forfeited,
        forfeited_by: game.forfeited_by,
        attendance: game.attendance,
        mainReferee: game.mainReferee ? game.mainReferee.id.toString() : undefined,
        secondReferee: game.secondReferee ? game.secondReferee.id.toString() : undefined,
        thirdReferee: game.thirdReferee ? game.thirdReferee.id.toString() : undefined,
        staffers: game.staffers?.map((st) => st.id.toString()),
        gallery: game.gallery,
      }
    : undefined;

  return (
    <FormPageLayout>
      {mode === 'edit' && game && <EditGameWarning />}
      <GameForm
        game={game}
        onSubmit={(data) => mutation.mutate(data)}
        mode={mode}
        defaultValues={defaultValues}
        isSuccess={mutation.isSuccess}
      />
      <Toaster position="bottom-right" />
    </FormPageLayout>
  );
};

export default GameFormPage;
```

> **Note on `useGameDetails`:** The existing hook hits `API_ROUTES.game.details(id)` which populates home_team, away_team, staffers, referees, venue. If `game.competition.id` is unavailable (competition not populated), use `game.league_name` and `game.league_short_name` directly for those fields — they are direct text fields on the game record. If you need the competition ID for the form dropdown, add `&populate[competition]=*` to `API_ROUTES.game.details` or create a local override fetch in this file.

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Dashboard/Game/GameFormPage.tsx
git commit -m "feat: GameFormPage consolidates CreateGame and EditGame, removes filter cascade"
```

---

## Task 13: Frontend — PlayerStatsFormPage and TeamStatsFormPage

**Files:**
- Create: `frontend/src/hooks/queries/player-stats/UsePlayerStatById.ts`
- Create: `frontend/src/hooks/queries/team-stats/UseTeamStatById.ts`
- Create: `frontend/src/components/Dashboard/PlayerStats/PlayerStatsFormPage.tsx`
- Create: `frontend/src/components/Dashboard/TeamStats/TeamStatsFormPage.tsx`

- [ ] **Step 1: Create UsePlayerStatById.ts**

```ts
// frontend/src/hooks/queries/player-stats/UsePlayerStatById.ts
import apiClient from '@/lib/ApiClient';
import { useQuery } from '@/hooks/UseQueryWithToast';
import { PlayerStatsResponse } from '@/types/api/PlayerStats';

export const usePlayerStatById = (id: string) => {
  return useQuery<PlayerStatsResponse>({
    queryKey: ['player-stat-detail', id],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/player-stats/${id}?populate[player]=*&populate[team]=*&populate[game][populate][competition]=*&populate[game][populate][home_team]=*&populate[game][populate][away_team]=*`
      );
      return res.data.data;
    },
    enabled: !!id,
    errorMessage: 'Failed to load player stat record',
  });
};
```

- [ ] **Step 2: Create UseTeamStatById.ts**

```ts
// frontend/src/hooks/queries/team-stats/UseTeamStatById.ts
import apiClient from '@/lib/ApiClient';
import { useQuery } from '@/hooks/UseQueryWithToast';
import { TeamStatsResponse } from '@/types/api/TeamStats';

export const useTeamStatById = (id: string) => {
  return useQuery<TeamStatsResponse>({
    queryKey: ['team-stat-detail', id],
    queryFn: async () => {
      const res = await apiClient.get(
        `/api/team-stats/${id}?populate[team]=*&populate[coach]=*&populate[assistantCoach]=*&populate[game][populate][competition]=*&populate[game][populate][home_team]=*&populate[game][populate][away_team]=*`
      );
      return res.data.data;
    },
    enabled: !!id,
    errorMessage: 'Failed to load team stat record',
  });
};
```

- [ ] **Step 3: Create PlayerStatsFormPage.tsx**

The key change from `EditPlayerStats.tsx`: the 5-level filter cascade is removed. The stats record is fetched directly by documentId. The `defaultValues` mapping is adapted from `EditPlayerStats.tsx` with `season` and `league` derived from the populated game relation.

```tsx
// frontend/src/components/Dashboard/PlayerStats/PlayerStatsFormPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import PlayerStatsForm from '@/components/forms/player-stats/PlayerStatsForm';
import { usePlayerStatById } from '@/hooks/queries/player-stats/UsePlayerStatById';
import FormPageLayout from '@/layouts/FormPageLayout';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { createPlayerStats } from '@/services/player-stats/CreatePlayerStats';
import { updatePlayerStats } from '@/services/player-stats/UpdatePlayerStats';

const PlayerStatsFormPage: React.FC = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const mode = documentId ? 'edit' : 'create';

  const { data: playerStat } = usePlayerStatById(documentId ?? '');

  const mutation = useMutation({
    mutationFn: (data: PlayerStatsFormData) =>
      documentId ? updatePlayerStats({ ...data, id: documentId }) : createPlayerStats(data),
    onSuccess: () => toast.success(mode === 'create' ? 'Player stats created' : 'Player stats updated'),
    onError: (error: Error) => toast.error(`Error: ${error.message}`),
  });

  const defaultValues = playerStat
    ? (() => {
        const p = playerStat;
        const isDnp = p.status === 'dnp-cd';
        const hasOffAndDef =
          p.offensiveRebounds !== null &&
          p.offensiveRebounds !== undefined &&
          p.defensiveRebounds !== null &&
          p.defensiveRebounds !== undefined;
        const toStr = (v: unknown) => (v === null || v === undefined ? '' : String(v));

        return {
          season: p.game?.season ?? '',
          league: p.game?.competition?.documentId ?? '',
          gameId: p.game?.id?.toString() ?? '',
          teamId: p.team?.id?.toString() ?? '',
          playerId: p.player?.id?.toString() ?? '',
          status: p.status,
          isCaptain: p.isCaptain,
          playerNumber: isDnp ? '' : toStr(p.playerNumber),
          minutes: isDnp ? '' : toStr(p.minutes),
          seconds: isDnp ? '' : toStr(p.seconds),
          points: isDnp ? '' : toStr(p.points),
          fieldGoalsMade: isDnp ? '' : toStr(p.fieldGoalsMade),
          fieldGoalsAttempted: isDnp ? '' : toStr(p.fieldGoalsAttempted),
          threePointersMade: isDnp ? '' : toStr(p.threePointersMade),
          threePointersAttempted: isDnp ? '' : toStr(p.threePointersAttempted),
          freeThrowsMade: isDnp ? '' : toStr(p.freeThrowsMade),
          freeThrowsAttempted: isDnp ? '' : toStr(p.freeThrowsAttempted),
          rebounds: isDnp ? '' : hasOffAndDef ? '' : toStr(p.rebounds),
          offensiveRebounds: isDnp ? '' : toStr(p.offensiveRebounds),
          defensiveRebounds: isDnp ? '' : toStr(p.defensiveRebounds),
          assists: isDnp ? '' : toStr(p.assists),
          steals: isDnp ? '' : toStr(p.steals),
          blocks: isDnp ? '' : toStr(p.blocks),
          turnovers: isDnp ? '' : toStr(p.turnovers),
          fouls: isDnp ? '' : toStr(p.fouls),
          foulsOn: isDnp ? '' : toStr(p.foulsOn),
          blocksReceived: isDnp ? '' : toStr(p.blocksReceived),
          plusMinus: isDnp ? '' : toStr(p.plusMinus),
          efficiency: isDnp ? '' : toStr(p.efficiency),
        };
      })()
    : undefined;

  return (
    <FormPageLayout>
      <PlayerStatsForm
        key={documentId}
        onSubmit={(data) => mutation.mutate(data)}
        mode={mode}
        defaultValues={defaultValues}
        isSuccess={mutation.isSuccess}
      />
      <Toaster position="bottom-right" />
    </FormPageLayout>
  );
};

export default PlayerStatsFormPage;
```

- [ ] **Step 4: Create TeamStatsFormPage.tsx**

```tsx
// frontend/src/components/Dashboard/TeamStats/TeamStatsFormPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import TeamStatsForm from '@/components/forms/team-stats/TeamStatsForm';
import { useTeamStatById } from '@/hooks/queries/team-stats/UseTeamStatById';
import FormPageLayout from '@/layouts/FormPageLayout';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { createTeamStats } from '@/services/team-stats/CreateTeamStats';
import { updateTeamStats } from '@/services/team-stats/UpdateTeamStats';

const TeamStatsFormPage: React.FC = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const mode = documentId ? 'edit' : 'create';

  const { data: teamStat } = useTeamStatById(documentId ?? '');

  const mutation = useMutation({
    mutationFn: (data: TeamStatsFormData) =>
      documentId ? updateTeamStats({ ...data, id: documentId }) : createTeamStats(data),
    onSuccess: () => toast.success(mode === 'create' ? 'Team stats created' : 'Team stats updated'),
    onError: (error: Error) => toast.error(`Error: ${error.message}`),
  });

  const defaultValues = teamStat
    ? {
        season: teamStat.game?.season ?? '',
        league: teamStat.game?.competition?.documentId ?? '',
        gameId: teamStat.game?.id?.toString() ?? '',
        teamId: teamStat.team?.id?.toString() ?? '',
        coachId: teamStat.coach?.id?.toString() ?? '',
        assistantCoachId: teamStat.assistantCoach?.id?.toString() ?? '',
        firstQuarter: teamStat.firstQuarter?.toString() ?? '',
        secondQuarter: teamStat.secondQuarter?.toString() ?? '',
        thirdQuarter: teamStat.thirdQuarter?.toString() ?? '',
        fourthQuarter: teamStat.fourthQuarter?.toString() ?? '',
        overtime: teamStat.overtime ? teamStat.overtime.toString() : null,
        fieldGoalsMade: teamStat.fieldGoalsMade?.toString() ?? '',
        fieldGoalsAttempted: teamStat.fieldGoalsAttempted?.toString() ?? '',
        threePointersMade: teamStat.threePointersMade?.toString() ?? '',
        threePointersAttempted: teamStat.threePointersAttempted?.toString() ?? '',
        freeThrowsMade: teamStat.freeThrowsMade?.toString() ?? '',
        freeThrowsAttempted: teamStat.freeThrowsAttempted?.toString() ?? '',
        rebounds: teamStat.rebounds?.toString() ?? '',
        offensiveRebounds: teamStat.offensiveRebounds?.toString() ?? '',
        defensiveRebounds: teamStat.defensiveRebounds?.toString() ?? '',
        assists: teamStat.assists?.toString() ?? '',
        turnovers: teamStat.turnovers?.toString() ?? '',
        steals: teamStat.steals?.toString() ?? '',
        blocks: teamStat.blocks?.toString() ?? '',
        fouls: teamStat.fouls?.toString() ?? '',
        secondChancePoints: teamStat.secondChancePoints?.toString() ?? '',
        fastBreakPoints: teamStat.fastBreakPoints?.toString() ?? '',
        pointsOffTurnovers: teamStat.pointsOffTurnovers?.toString() ?? '',
        benchPoints: teamStat.benchPoints?.toString() ?? '',
        pointsInPaint: teamStat.pointsInPaint?.toString() ?? '',
      }
    : undefined;

  return (
    <FormPageLayout>
      <TeamStatsForm
        onSubmit={(data) => mutation.mutate(data)}
        mode={mode}
        defaultValues={defaultValues}
        isSuccess={mutation.isSuccess}
      />
      <Toaster position="bottom-right" />
    </FormPageLayout>
  );
};

export default TeamStatsFormPage;
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/hooks/queries/player-stats/UsePlayerStatById.ts \
        frontend/src/hooks/queries/team-stats/UseTeamStatById.ts \
        frontend/src/components/Dashboard/PlayerStats/PlayerStatsFormPage.tsx \
        frontend/src/components/Dashboard/TeamStats/TeamStatsFormPage.tsx
git commit -m "feat: PlayerStatsFormPage and TeamStatsFormPage with by-ID fetch, removes filter cascade"
```

---

## Task 14: Frontend — delete old Create/Edit files

**Files:**
- Delete: all 20 Create*.tsx and Edit*.tsx files listed in File Structure above

- [ ] **Step 1: Delete old wrapper files**

```bash
cd frontend/src/components/Dashboard

rm Player/CreatePlayer.tsx Player/EditPlayer.tsx
rm Team/CreateTeam.tsx Team/EditTeam.tsx
rm Coach/CreateCoach.tsx Coach/EditCoach.tsx
rm Referee/CreateReferee.tsx Referee/EditReferee.tsx
rm Staff/CreateStaff.tsx Staff/EditStaff.tsx
rm Game/CreateGame.tsx Game/EditGame.tsx
rm Venue/CreateVenue.tsx Venue/EditVenue.tsx
rm Competition/CreateCompetition.tsx Competition/EditCompetition.tsx
rm PlayerStats/CreatePlayerStats.tsx PlayerStats/EditPlayerStats.tsx
rm TeamStats/CreateTeamStats.tsx TeamStats/EditTeamStats.tsx
```

- [ ] **Step 2: TypeScript check — expect zero import errors**

```bash
cd /home/litovic/projects/zadar-museum/frontend && npx tsc --noEmit 2>&1 | head -40
```

Expected: zero errors. If any file still imports from a deleted path, fix those imports now.

- [ ] **Step 3: Commit**

```bash
cd /home/litovic/projects/zadar-museum
git add -A
git commit -m "feat: remove obsolete Create/Edit dashboard wrapper components"
```

---

## Task 15: E2E verification

- [ ] **Step 1: Start dev stack**

```bash
make dev
```

Wait for all services to be ready.

- [ ] **Step 2: Apply materialized views**

```bash
make dev-mv
```

- [ ] **Step 3: Verify admin list endpoints**

```bash
curl "http://localhost:1337/api/dashboard/admin/players?page=1&pageSize=5" | python3 -m json.tool
curl "http://localhost:1337/api/dashboard/admin/players?page=1&pageSize=5&search=ko" | python3 -m json.tool
```

Expected: `{ "data": [...], "meta": { "total": N, "page": 1, "pageSize": 5 } }`. Search should filter results.

- [ ] **Step 4: Browser walkthrough — open http://localhost:5173/dashboard**

1. Confirm redirect lands on `/dashboard/player/list`
2. Sidebar shows plain labels (no + / ✏ buttons)
3. List loads 20 players, shows pagination controls and total count
4. Type a name in search → list updates after 300ms debounce
5. Click "Next →" → page 2 loads
6. Click "Edit" on a row → navigates to `/dashboard/player/edit/:id`, form pre-fills
7. Submit edit form → toast success, back on list page (navigate programmatically if needed)
8. Click "Create new Player" → navigates to `/dashboard/player/create`, form is empty, submit works
9. Click "Delete" on a row → AlertDialog appears, "Cancel" closes it without deleting, "Delete" removes the record and list refreshes
10. Repeat steps 1–9 for Team, Coach, and Game (representative sample)
11. Navigate to Player Stats list — rows show player name + game matchup
12. Click Edit on a Player Stats row → form pre-fills with correct values (season, points, etc.)
13. Sidebar active state highlights the current section

- [ ] **Step 5: TypeScript build check**

```bash
cd frontend && npm run build 2>&1 | tail -20
```

Expected: `✓ built in X.Xs` with no TypeScript errors.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete dashboard overhaul — list pages, shadcn UI, consolidated form pages, delete"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Sidebar — pure nav labels, no icons (Task 6)
- ✅ List page — pagination, search, create button, edit/delete per row (Tasks 7–9)
- ✅ Server-side search (Task 2 backend, Tasks 7–8 frontend)
- ✅ Delete with confirmation dialog (Task 8 EntityListPage)
- ✅ shadcn install (Task 1)
- ✅ react-select — already installed; used in existing forms (no additional migration needed for this sprint)
- ✅ Create/Edit duplication removed (Tasks 11–13)
- ✅ Form reset logic untouched — form internals not modified
- ✅ DashboardRoutes updated (Task 5)
- ✅ Route constants updated (Task 4)
- ✅ Old files deleted (Task 14)

**Type consistency:**
- `EntityListConfig<T>` defined in `types.ts`, used in all 10 configs and `EntityListPage`
- `AdminListResponse<T>` defined in `types.ts`, returned by `useAdminList`
- `APP_ROUTES.dashboard.*.edit` trailing slash pattern preserved — navigation uses `editPath + documentId`
- `DashboardNavItem` type updated to `{ label, listPath }` — `DashboardSidebar.tsx` passes `navItems` directly, no structural change needed

**Potential runtime issues to watch:**
- `game.competition.id` in `GameFormPage` defaultValues — if competition isn't populated in the existing `useGameDetails` response, the competition dropdown in the game form will be empty. If this happens, add `&populate[competition]=*` to `API_ROUTES.game.details` and update `GameDetailsResponse` if needed.
- `TeamStatsResponse` type — verify `assistantCoach` field exists on the type before using `teamStat.assistantCoach`.
- `PlayerStatsResponse` has `game: GameDetailsResponse` — but `game.competition` may not always be populated from the standard dashboard fetch. The `UsePlayerStatById` hook uses a deep populate that includes `game.competition`, so this is covered for the edit form.
