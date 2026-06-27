# Performance Audit — Zadar Basketball Museum

**Date:** 2026-06-16  
**Scope:** SQL materialized views (488 files), backend API services, frontend query hooks  
**Focus:** Performance bottlenecks, slow queries, redundancy, over-fetching

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| Total SQL files | 488 |
| Layer 1 base MVs | 4 |
| Layer 2 aggregation MVs | 463 |
| Layer 3 consolidation MVs | 21 |
| SQL indexes created | **0** |
| Backend services without caching | **8** (entire coach service) |
| Frontend hooks without `staleTime` override | ~85 of ~87 hooks |
| Orphaned JOINs in schedule.sql | 3 (produce no output columns) |

**Severity counts:**

| Priority | Count | Summary |
|----------|-------|---------|
| P0 | 4 | Blocking or severe — zero indexes, schedule.sql orphaned JOINs, coach service entirely uncached, unbounded `find()` |
| P1 | 9 | High — self-join in coach_boxscore, JSON.parse overhead, no concurrent REFRESH, game service uncached, SELECT *, _prev doubling, repeat CTEs in referee stats, duplicate function in player-stat.ts |
| P2 | 8 | Medium — N+1 requests on detail pages, missing enabled guards, query key collision, staleTime not tuned for immutable data, populate=*, age_decimal inline computation, LEFT JOIN on mandatory relations |

---

## 2. SQL Layer Analysis — Layer 1 Base Views

### 2.1 `schedule.sql` — Three Orphaned JOINs [P0]

**File:** `sql/Layer 1/schedule.sql`, lines 110–122

```sql
-- Team stats
LEFT JOIN team_stats_game_lnk tsglnk ON tsglnk.game_id = g.id
LEFT JOIN team_stats ts ON ts.id = tsglnk.team_stat_id
LEFT JOIN team_stats_team_lnk tlnk ON tlnk.team_stat_id = ts.id
```

None of `tsglnk`, `ts`, or `tlnk` columns appear in the SELECT list. These three joins exist purely to inflate the intermediate row count, which is then collapsed by `DISTINCT(g.id)` at line 4. A single game with two team_stat rows becomes two intermediate rows that DISTINCT must then deduplicate.

Impact: Every refresh of `schedule` reads `team_stats_game_lnk`, `team_stats`, and `team_stats_team_lnk` for zero benefit. All coach and score data comes from the `team_boxscore` LEFT JOINs at lines 115–122 — the right approach. The three orphaned joins should be deleted.

**Fix:** Remove lines 110–112 entirely and drop the `DISTINCT` — change `SELECT DISTINCT(g.id) AS game_id` to `SELECT g.id AS game_id`.

---

### 2.2 `coach_boxscore.sql` — Self-Join on `team_boxscore` [P1]

**File:** `sql/Layer 1/coach_boxscore.sql`, lines 36–39

```sql
FROM public.team_boxscore tb
JOIN public.team_boxscore opp 
    ON opp.game_id = tb.game_id
   AND opp.team_id != tb.team_id
```

This is a self-join on the `team_boxscore` MV to find each team's opponent. For every game (2 rows in team_boxscore: one per team), this join reads the entire team_boxscore twice and produces 4 intermediate rows per game (home×home, home×away, away×home, away×away) before the `opp.team_id != tb.team_id` filter removes 2 of them.

For a dataset of N games (2N team_boxscore rows), the intermediate cross-product is O(4N) before filtering. This is unavoidable if coach_boxscore needs opponent info, but it means coach_boxscore is more expensive to refresh than team_boxscore despite containing less information.

**Alternative:** Store opponent_name/opponent_score in team_boxscore directly and avoid the self-join in coach_boxscore entirely.

---

### 2.3 `player_boxscore.sql` — Inline Epoch Age Calculation [P2]

**File:** `sql/Layer 1/player_boxscore.sql`, line 32

```sql
round(EXTRACT(epoch FROM g.date::timestamp without time zone - p.date_of_birth::timestamp without time zone) / (365.25 * 24::numeric * 60::numeric * 60::numeric), 1) AS age_decimal
```

This expression is computed for every row at every REFRESH. It involves:
- Two explicit casts to `timestamp without time zone`
- An epoch EXTRACT (interval arithmetic)
- A division by a multi-multiplication constant that is re-evaluated per row instead of being a literal (`31,557,600.0`)

Minor at MV-creation time, but unnecessarily verbose. Should be simplified to:
```sql
round(EXTRACT(epoch FROM (g.date::date - p.date_of_birth::date) * interval '1 day') / 31557600.0, 1)
```

---

### 2.4 `team_boxscore.sql` — LEFT JOINs on Mandatory Relations [P2]

**File:** `sql/Layer 1/team_boxscore.sql`, lines 92–116

All joins use `LEFT JOIN` including relations that should be mandatory (every team_stat must have a game, a team, and a competition). Specifically:

```sql
LEFT JOIN team_stats_game_lnk tsglnk ON tsglnk.team_stat_id = ts.id
LEFT JOIN games g ON tsglnk.game_id = g.id
LEFT JOIN team_stats_team_lnk tstlnk ON tstlnk.team_stat_id = ts.id
LEFT JOIN teams t ON t.id = tstlnk.team_id
LEFT JOIN games_competition_lnk gclnk ON gclnk.game_id = g.id
LEFT JOIN competitions c ON c.id = gclnk.competition_id
```

`LEFT JOIN` on mandatory relations prevents PostgreSQL's join order optimizer from reordering these joins as inner joins, losing potential plan improvements. For data integrity reasons, orphaned `team_stats` rows (no game, no team) should not exist — using `INNER JOIN` on these three link tables would produce identical results while giving the planner more freedom.

---

## 3. SQL Layer Analysis — Layer 2/3 Aggregation Views

### 3.1 The 4× Location Variant Explosion [P1]

Every entity in Layer 2 is materialized as four separate views:
- `{entity}` (total)
- `{entity}_home`
- `{entity}_away`
- `{entity}_neutral`

These four variants share nearly identical SQL — differing only by a single WHERE clause on `is_home_team` or `home_team_name`. With 463 Layer 2 files, this means approximately 115 distinct logical queries are materialized 4× each.

**Problem:** Each variant independently re-reads the Layer 1 source MV from scratch. For example, `team_average_stats.sql`, `team_average_stats_home.sql`, `team_average_stats_away.sql`, and `team_average_stats_neutral.sql` each:
1. Read from `schedule`
2. Build a `UNION ALL` of home + away rows (reading schedule **twice** per variant)
3. Aggregate by team
4. Compute rank window functions

That's `4 variants × 2 schedule reads = 8 full scans of schedule` for what is conceptually one dataset with a location column.

**Fix:** Consolidate into a single MV with a `location` column (`home`/`away`/`neutral`/`total`), indexed on `(team_id, location)`. Backend queries filter by location. This reduces 4 MVs to 1 and cuts schedule reads from 8 to 2.

---

### 3.2 Referee Stats Rebuild Raw Tables Instead of Using Layer 1 MVs [P1]

**File:** `sql/Layer 2/referee/all_time/referee_stats.sql` and `referee_stats_home.sql`

Both files contain a full `game_scores` CTE that independently joins:
```sql
FROM games g
    JOIN games_home_team_lnk ghtlnk ...
    JOIN teams ht ...
    JOIN games_away_team_lnk gatlnk ...
    JOIN teams at ...
    LEFT JOIN games_main_referee_lnk gmrlnk ...
    LEFT JOIN referees mr ...
    LEFT JOIN games_second_referee_lnk gsrlnk ...
    LEFT JOIN referees sr ...
    LEFT JOIN games_third_referee_lnk gtrlnk ...
    LEFT JOIN referees tr ...
    LEFT JOIN team_stats_game_lnk tsglnk ...
    LEFT JOIN team_stats ts ...
    LEFT JOIN team_stats_team_lnk tlnk ...
```

This is 13 joins on raw Strapi tables, duplicating the work already done by `schedule` (Layer 1). The `schedule` MV already has referee IDs, home/away scores (from team_boxscore), fouls (from team_stats), and all team data — all pre-joined. Referee stats should query `schedule`, not rebuild the entire game join chain.

Same issue exists across all referee, venue, and possibly team-record Layer 2 variants.

---

### 3.3 Multiple RANK() Window Functions Over Same Partition [P1]

**File:** `sql/Layer 2/referee/all_time/referee_stats.sql`, lines 102–190

```sql
count(DISTINCT CASE WHEN ... THEN u.game_id ELSE NULL END) AS games,
rank() OVER (ORDER BY count(DISTINCT CASE ...) DESC) AS games_rank,

sum(CASE WHEN ... THEN 1 ELSE 0 END) AS wins,
rank() OVER (ORDER BY sum(CASE ...) DESC) AS wins_rank,

sum(CASE WHEN ... THEN 1 ELSE 0 END) AS losses,
rank() OVER (ORDER BY sum(CASE ...) DESC) AS losses_rank,
...
```

Seven separate `rank() OVER (ORDER BY ...)` calls, each with a different ORDER BY. PostgreSQL must execute 7 separate sort passes over the grouped result set. The aggregate expressions inside each window function's ORDER BY clause (e.g., `count(DISTINCT CASE ...)`) are also re-evaluated for each window function independently.

Same pattern exists in `zadar_player_record.sql` (13 rank() calls, lines 46–101) and `zadar_head_coach_record.sql` (6 rank() calls).

**Fix:** Consider computing ranks in a follow-up CTE after the GROUP BY, so each aggregate is computed once and then ranked once per dimension:
```sql
SELECT ...,
  RANK() OVER (ORDER BY games DESC) AS games_rank,
  RANK() OVER (ORDER BY wins DESC) AS wins_rank
FROM (
  SELECT ref_id, COUNT(*) AS games, SUM(CASE ... END) AS wins ...
  FROM ...
  GROUP BY ref_id
) agg
```
This pattern separates aggregate computation from ranking, avoiding re-evaluation.

---

### 3.4 Layer 3 "Full" MVs: 8-Way JOIN with DISTINCT ON Subqueries [P1]

**File:** `sql/Layer 3/player/zadar/zadar_player_record_full.sql`, lines 448–487

```sql
FROM (
  SELECT DISTINCT ON (player_id) *
  FROM public.zadar_player_total_all_time
  ORDER BY player_id
) total
LEFT JOIN (
  SELECT DISTINCT ON (player_id) *
  FROM public.zadar_player_total_all_time_home
  ORDER BY player_id
) home ON total.player_id = home.player_id
-- ... 6 more LEFT JOINs
```

Each `DISTINCT ON (player_id)` subquery sorts its entire source MV. Eight sort passes before the outer join. The final MV packs everything into two enormous JSONB blobs (`total` and `average`) containing 8 nested objects with ~20 fields each.

The resulting row is hundreds of columns wide when deserialized in Node.js (`JSON.parse(player.total)` at `backend/src/api/player/services/player.ts:106`), with all location variants in memory simultaneously even when only one is needed.

**Fix:** The Layer 3 consolidation approach is correct (pre-join to avoid runtime JOIN cost), but the intermediate `DISTINCT ON` subqueries are needed because the Layer 2 MVs may have duplicates. Adding a unique index on `player_id` to each Layer 2 MV would eliminate the need for `DISTINCT ON` in Layer 3, turning 8 sort passes into 8 index lookups.

---

### 3.5 Zero Indexes Across All 488 SQL Files [P0]

```
$ grep -rn "CREATE INDEX\|CREATE UNIQUE INDEX" sql/ | wc -l
0
```

Every query against a materialized view does a full sequential scan. Backend services commonly filter MVs by `player_id`, `team_slug`, `coach_id`, `league_slug`, `season`, and combinations thereof. Without indexes:

- `knex(table).where("player_id", playerId)` → full seq scan of the MV
- `knex("schedule").where("home_team_slug", teamSlug)` → full seq scan of schedule
- `knex(table).where("coach_id", coachId)` → full seq scan

For small datasets this is fast, but as historical data grows, every query degrades linearly. This also affects the `DISTINCT ON (player_id)` operations in Layer 3 MVs, which sort full MVs because there are no indexes to support a sorted-index scan.

**Minimum recommended indexes:**

```sql
-- On player_boxscore
CREATE INDEX idx_pb_player_season ON player_boxscore (player_id, season);
CREATE INDEX idx_pb_team_slug ON player_boxscore (team_slug);
CREATE INDEX idx_pb_game_id ON player_boxscore (game_id);

-- On team_boxscore
CREATE INDEX idx_tb_game_id ON team_boxscore (game_id);
CREATE INDEX idx_tb_team_slug ON team_boxscore (team_slug);

-- On schedule
CREATE INDEX idx_sched_home_team ON schedule (home_team_slug);
CREATE INDEX idx_sched_away_team ON schedule (away_team_slug);
CREATE INDEX idx_sched_home_hc ON schedule (home_head_coach_id);
CREATE INDEX idx_sched_away_hc ON schedule (away_head_coach_id);
CREATE INDEX idx_sched_home_ac ON schedule (home_assistant_coach_id);
CREATE INDEX idx_sched_away_ac ON schedule (away_assistant_coach_id);
CREATE INDEX idx_sched_season ON schedule (season);
CREATE INDEX idx_sched_game_doc_id ON schedule (game_document_id);

-- On coach_boxscore
CREATE INDEX idx_cb_coach_id ON coach_boxscore (coach_id);

-- On all Layer 2 player MVs (example pattern)
CREATE UNIQUE INDEX idx_zpar_player_id ON zadar_player_total_all_time (player_id);
-- (same for home/away/neutral variants — enables DISTINCT ON to use index)
```

---

### 3.6 `kk` CTE with CROSS JOIN in Referee Stats [P2]

**File:** `sql/Layer 2/referee/all_time/referee_stats.sql`, lines 2–6, line 193

```sql
WITH kk AS (
    SELECT teams.id AS kk_id
    FROM teams
    WHERE teams.name::text = 'KK Zadar'::text
    LIMIT 1
)
...
CROSS JOIN kk
```

The `kk` CTE is a single-row subselect to get KK Zadar's ID. The CROSS JOIN then propagates this single value to every grouped row in the final SELECT. This is effectively a scalar subquery dressed as a CROSS JOIN. Since this is a MV (computed at refresh time, not per query), the actual runtime cost is low, but the pattern is confusing and the CROSS JOIN reads `teams` unnecessarily. Use a subquery or literal value instead:

```sql
-- Replace the CROSS JOIN kk pattern with:
WHERE gs.home_team_id = (SELECT id FROM teams WHERE name = 'KK Zadar' LIMIT 1)
   OR gs.away_team_id = (SELECT id FROM teams WHERE name = 'KK Zadar' LIMIT 1)
```

Or better, filter the `game_scores` CTE directly using the team name columns already available in `schedule`.

---

## 4. Backend API Analysis

### 4.1 Entire Coach Service Has No Caching [P0]

**File:** `backend/src/api/coach/services/coach.ts`

All 8 methods in the coach service hit the database directly on every request:

| Method | Line | DB Target |
|--------|------|-----------|
| `findCoachTeamRecord` | 24 | `{db}_coach_record_full` |
| `findCoachGamelog` | 51 | `schedule` (full OR scan) |
| `findCoachSeasons` | 105 | `schedule` (full OR scan) |
| `findCoachSeasonCompetitions` | 125 | `schedule` (full OR scan) |
| `findCoachTeams` | 151 | `team_boxscore` |
| `findCoachLeagueRecord` | 160 | `{db}_coach_league_record_full` |
| `findCoachLeagueSeasonStats` | 190 | `{db}_coach_season_league_record_full` |
| `findCoachTotalSeasonStats` | 223 | `{db}_coach_season_record_full` |

Compare to `player.ts` where every method is wrapped in `getCached()` and `team.ts` similarly. Coach service was left uncached. Coach detail pages therefore generate 5–8 live DB queries per page load.

**Fix:** Wrap all coach service methods with `getCached()` using the same key patterns as player/team:
```typescript
return getCached(`zadar:coach:record:${coachId}:${validatedDb}`, TTL_24H, async () => {
  // existing query
});
```

---

### 4.2 Coach Gamelog Queries Unindexed Columns with OR Conditions [P0]

**File:** `backend/src/api/coach/services/coach.ts`, lines 61–101

```typescript
return await knex("schedule")
    .where(function () {
        this.where("home_head_coach_id", coachId).orWhere("home_assistant_coach_id", coachId);
    })
    .orWhere(function () {
        this.where("away_head_coach_id", coachId).orWhere("away_assistant_coach_id", coachId);
    })
    .orderBy("game_date", "asc");
```

This query filters the `schedule` MV across 4 columns (`home_head_coach_id`, `home_assistant_coach_id`, `away_head_coach_id`, `away_assistant_coach_id`) with OR conditions. There are no indexes on any of these columns (see §3.5). PostgreSQL must do a full sequential scan of `schedule` for every coach gamelog request.

Same pattern in `findCoachSeasons` (lines 105–123) and `findCoachSeasonCompetitions` (lines 125–149).

**Fix:** Add indexes (see §3.5) AND cache the results.

---

### 4.3 Unbounded `schedule.find()` [P0]

**File:** `backend/src/api/schedule/services/schedule.ts`, lines 3–6

```typescript
async find() {
    const knex = strapi.db.connection;
    return await knex("schedule").select("*");
}
```

This method fetches the entire `schedule` MV with no filter, no LIMIT, no cache. The schedule MV has a row for every game ever played plus all referee, venue, coach, and team name data — it's one of the widest tables in the system. If this endpoint is reachable, it transfers the entire dataset on every call.

Check whether this method is actually called anywhere. If not, delete it. If it is, it needs pagination and caching at minimum.

---

### 4.4 `stats.ts` Live-Joins Back to `players` Table [P1]

**File:** `backend/src/api/stats/services/stats.ts`, lines 24–27

```typescript
const query = knex(table)
    .select(`${table}.*`, "players.is_active_player")
    .leftJoin("players", `${table}.player_id`, "players.document_id")
    .orderBy("points", "desc");
const prevQuery = knex(prevTable)
    .select(`${prevTable}.*`, "players.is_active_player")
    .leftJoin("players", `${prevTable}.player_id`, "players.document_id")
    .orderBy("points", "desc");
```

The all-time stats MVs are queried with a live LEFT JOIN back to the `players` table to fetch `is_active_player`. This negates the purpose of pre-computing the MV — the query is no longer a simple MV scan but a runtime join. Additionally, the `players.is_active_player` field could change at any time, but the result is cached for 24H, making the cached data stale anyway.

**Fix:** Include `is_active_player` in the MV definition at refresh time. At creation, do a one-time join. At refresh, the field is current. The backend query then needs no join:
```sql
-- In the zadar_player_total_all_time MV
LEFT JOIN players p ON p.document_id = pb.player_id
-- Add: p.is_active_player AS is_active_player
```

---

### 4.5 `_prev` Table Pattern Doubles All Stats Queries [P1]

**File:** `backend/src/api/stats/services/stats.ts`, lines 28–43

```typescript
const prevQuery = knex(prevTable)
    .select(`${prevTable}.*`, "players.is_active_player")
    .leftJoin(...)
    .orderBy("points", "desc");
// ...
const [data, prevData] = await Promise.all([query, prevQuery]);
```

For both `findPlayersAllTimeStats` (line 29) and `findCoachesAllTimeStats` (line 219), the service fires two queries simultaneously — one against `${table}` and one against `${table}_prev`. The `_prev` variants exist to track rank changes between "current" and "previous" period coach/player records.

This doubles the number of table scans. Every stats API call reads two separate MVs. With 463 Layer 2 MVs, the `_prev` suffix means roughly 50+ additional MVs exist solely for rank comparison.

**Alternative:** Include a `period` column (`'current'`/`'previous'`) in a unified MV, with an index on `(player_id, period)`. A single query with `WHERE period IN ('current', 'previous')` replaces two separate table scans.

---

### 4.6 Game Service Methods Are Entirely Uncached [P1]

**File:** `backend/src/api/game/services/game.ts`

```typescript
async findGameTeamStats(gameId) {
    return await knex("team_boxscore").select("*").where("game_id", gameId);
}

async findGameScore(gameId) {
    return await knex("schedule").select("*").where("game_document_id", gameId);
}

async findGameBoxscore(gameId, teamSlug) {
    return await knex("player_boxscore").select("*").where("game_id", gameId)
        .andWhere("team_slug", teamSlug);
}
```

Game data is historical — once a game is played and entered, it never changes. Yet all three of these methods hit the DB on every request with no caching. A game detail page fires all three simultaneously (plus `findTeamCoaches` at line 99 which uses `strapi.db.query`).

`findGameScore` also fetches all 40+ columns of `schedule` when only score columns (`home_score`, `away_score`) are needed.

**Fix:** Wrap in `getCached(key, TTL_24H, ...)`. For the score query, select only needed columns:
```typescript
return await knex("schedule")
    .select("home_score", "away_score", "home_team_name", "away_team_name", "game_date")
    .where("game_document_id", gameId);
```

---

### 4.7 Duplicate `findPlayersAllTimeStats` in `player-stat.ts` [P1]

**File:** `backend/src/api/player-stats/services/player-stat.ts`, lines 10–34

This file contains a `findPlayersAllTimeStats` method that is functionally identical to the one in `stats.ts:8–51`, but without caching, without the `_prev` query, and with a subtle bug: it checks `if (league)` (line 24) instead of `if (includeLeague)` — meaning a league value of `"all"` would still filter by `league_slug = "all"`, returning no results.

This function appears to be dead code replaced by the `stats` service, but it still compiles and could be accidentally used. Delete it.

---

### 4.8 `player.profile.details` Uses Wildcard Populate [P2]

**API Route:** `Routes.ts:59` → `${root}/players/${id}?populate=*`

Strapi's `populate=*` fetches all relations to depth 1. For a player entity, this includes every related entity (teams, image, etc.) across all many-to-many and one-to-many relations. This is appropriate for the edit dashboard but is used for the public player profile view as well. It over-fetches whatever relations exist on the schema.

**Fix:** Specify exactly which relations are needed:
```
?populate[image]=true&populate[teams][fields][0]=name&populate[teams][fields][1]=slug
```

---

## 5. Frontend Query Analysis

### 5.1 Player/Coach Detail Pages Fire 6–8 Parallel Requests [P2]

A player detail page mounts multiple independent hooks simultaneously:

| Hook | File | API Endpoint |
|------|------|--------------|
| `usePlayerDetails` | `UsePlayerDetails.ts` | `/api/players/{id}?populate=*` |
| `usePlayerSeasons` | `UsePlayerSeasons.ts` | `/api/players/seasons/{id}/zadar` |
| `usePlayerBoxscore` | `UsePlayerBoxscore.ts` | `/api/players/boxscore?playerId=...` |
| `useAllTimeStats` | `UseAllTimeStats.ts` | `/api/players/stats/zadar/all-time?playerId=...` |
| `useAllTimeLeagueStats` | `UseAllTimeLeagueStats.ts` | `/api/players/stats/zadar/all-time/league?playerId=...` |
| `usePlayerCareerHigh` | `UsePlayerCareerHigh.ts` | `/api/players/stats/zadar/career-high/{id}` |
| `usePlayerSeasonAverage` | `UsePlayerSeasonAverage.ts` | `/api/players/stats/zadar/{season}/average/total/{id}` |
| `usePlayerSeasonLeagueAverage` | `UsePlayerSeasonLeagueAverage.ts` | `/api/players/stats/zadar/{season}/average/league/{id}` |

These are 8 HTTP requests per page load. While React Query fires them in parallel and the backend caches each independently, it means 8 round-trips vs. a potential 1–2.

The two season average hooks (`usePlayerSeasonAverage` + `usePlayerSeasonLeagueAverage`) are particularly good candidates for merging — they hit similar MVs and are always needed together on the player profile page.

---

### 5.2 Query Key Collision Between `useTeamSeasonStats` and `useSeasonLeagueStats` [P2]

**File 1:** `frontend/src/hooks/queries/team/UseTeamSeasonStats.ts:9`
```typescript
queryKey: ['season-league-stats', season, teamSlug],
```

**File 2:** `frontend/src/hooks/queries/coach/UseSeasonLeagueStats.ts:9`
```typescript
queryKey: ['season-league-stats', coachId, season, db],
```

If a team's season value and a coach's coachId happen to be the same string, and the season is in the same position, these keys can collide in the TanStack Query cache. With document IDs (UUIDs/slugs), the risk is low but non-zero. The first two key elements `['season-league-stats', ...]` overlap.

**Fix:** Add an entity discriminator as the second key element:
```typescript
queryKey: ['season-league-stats', 'team', season, teamSlug]
queryKey: ['season-league-stats', 'coach', coachId, season, db]
```

---

### 5.3 `usePlayerBoxscore` and `useGameBoxscore` Share `'boxscore'` Key Prefix [P2]

**File 1:** `frontend/src/hooks/queries/player/UsePlayerBoxscore.ts:8`
```typescript
queryKey: ['boxscore', playerId, season],
```

**File 2:** `frontend/src/hooks/queries/game/UseGameBoxscore.ts:8`
```typescript
queryKey: ['boxscore', gameId, teamSlug],
```

If `playerId === gameId` and `season === teamSlug` (both strings), these collide. The player boxscore endpoint returns per-player stats for a season; the game boxscore returns per-team game stats. These return different types — a collision would serve wrong data silently.

**Fix:**
```typescript
queryKey: ['player-boxscore', playerId, season]
queryKey: ['game-boxscore', gameId, teamSlug]
```

---

### 5.4 Missing `enabled` Guards on Season-Dependent Hooks [P2]

**File:** `frontend/src/hooks/queries/coach/UseSeasonLeagueStats.ts:9`
```typescript
enabled: !!coachId && !!db,
```

The `season` parameter is passed to this hook but not checked in `enabled`. If `season` is `undefined` or empty (before the seasons list loads), the hook fires with an empty season parameter and gets a 400 validation error from the backend.

Same issue in `useSeasonTotalStats` (`UseSeasonTotalStats.ts:8`): `enabled: !!coachId && !!db` — missing `!!season`.

And `usePlayerCareerHigh` (`UsePlayerCareerHigh.ts:8`) has no `enabled` guard at all despite the function signature allowing `playerId` to be undefined.

**Fix:**
```typescript
enabled: !!coachId && !!db && !!season
```

---

### 5.5 No `staleTime` Override for Immutable Historical Data [P2]

**File:** `frontend/src/main.tsx:16`
```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000  // 5 minutes global default
        }
    }
});
```

The global 5-minute staleTime means every hook that reads historical game data (boxscores, career stats, gamelog) will re-fetch when the user returns to the tab after 5 minutes. Historical game data is immutable — a player's boxscore from a 2001 game will never change.

Only `useGlobalSearch` has a custom staleTime (30 seconds, `UseGlobalSearch.ts:20`).

**Fix:** For hooks that read immutable data (game boxscores, career stats, all-time records), set `staleTime: Infinity`:
```typescript
// In UsePlayerBoxscore.ts, UseAllTimeStats.ts, UsePlayerCareerHigh.ts, etc.
staleTime: Infinity
```

For hooks that read data that can change (active player status, current team, schedule), keep the 5-minute default or use TTL_1H equivalent (3,600,000ms).

---

### 5.6 Global Search — No Debounce on the Enabled Guard [P2]

**File:** `frontend/src/hooks/queries/UseGlobalSearch.ts:19–21`
```typescript
enabled: term.trim().length > 1,
staleTime: 30_000,
```

The query fires as soon as the input has 2+ characters. If the search input is not debounced at the component level, this triggers a new API call on every keystroke. The hook itself has no debounce — it relies on the component to debounce before passing `term`. If the component using this hook passes the raw input value, each character fires 6 parallel DB queries (players, teams, coaches, venues, referees, competitions).

Verify the component using this hook debounces the input. If not, add `debounceMs: 300` at the component level or use a debounced query key.

---

### 5.7 `useTeamSeasonLeagueStats` Calls Wrong API Route [P2]

**File:** `frontend/src/hooks/queries/team/UseTeamSeasonLeagueStats.ts`

```typescript
export const useTeamSeasonLeagueStats = (season: string, teamSlug: string) => {
    return useQuery({
        queryKey: ['season-stats', season, teamSlug],
        // ...
    });
};

const getTeamSeasonLeagueStats = async (season: string, teamSlug: string) => {
    const res = await apiClient.get(API_ROUTES.team.stats.seasonTotalStats(teamSlug!, season!));
    // ...
};
```

The hook is named `useTeamSeasonLeagueStats` but calls `API_ROUTES.team.stats.seasonTotalStats` (the **total** stats endpoint, not the **league** stats endpoint). There's a separate `useTeamSeasonStats` hook in `UseTeamSeasonStats.ts` that calls `API_ROUTES.team.stats.seasonLeagueStats`. The two hooks appear to have their endpoint targets swapped.

Verify which hook should call which endpoint, then fix the naming or the route.

---

## 6. Cross-Cutting Issues

### 6.1 All 488 MVs Refresh Sequentially With Exclusive Locks [P1]

**File:** `backend/src/api/refresh/services/refresh.ts`, line 112

```typescript
await knex.raw(`REFRESH MATERIALIZED VIEW "${view}";`);
```

`REFRESH MATERIALIZED VIEW` (non-concurrent) takes an `AccessExclusiveLock` on the view during refresh, blocking all reads to that view. With 488 views refreshing one at a time, the total refresh time is the sum of all individual refresh times. During a full refresh, each view is unavailable for reads during its own refresh window.

The `apply-mvs.js` script supports `--concurrent` but the runtime `/api/refresh/views` endpoint does not use `CONCURRENTLY`. Concurrent refresh requires a unique index on the MV, which doesn't exist (§3.5).

**Fix path:**
1. Add unique indexes to Layer 2 MVs (§3.5)
2. Update `refreshAllViews()` to use `REFRESH MATERIALIZED VIEW CONCURRENTLY`
3. Views at the same dependency depth with no cross-dependencies can be refreshed in parallel using `Promise.all()` within a depth bucket

---

### 6.2 JSON.parse in Node.js Instead of PG JSON Type Parser [P1]

Multiple services call `JSON.parse()` on JSONB columns returned as strings:

- `player.ts:76`: `const total = JSON.parse(league.total);`
- `player.ts:200–208`: 9 separate `JSON.parse()` calls for career high fields
- `team.ts:79–82`: 4 `JSON.parse()` calls
- `coach.ts:41–42`: 2 `JSON.parse()` calls
- `coach.ts:177–183`: 2 `JSON.parse()` calls per coach row

The `pg` driver natively parses JSONB columns into JS objects. If columns are stored as JSONB type in PostgreSQL, the manual `JSON.parse()` indicates either:
1. The columns are stored as TEXT, not JSONB — losing PG-side JSON validation and compression
2. The `pg` type OID parser for JSONB is disabled

**Fix:** If columns are TEXT, change them to JSONB in the MV definitions (replace `jsonb_build_object(...)::text` or similar casts with plain `jsonb_build_object(...)`). Then configure the `pg` driver to automatically parse JSONB:
```javascript
// In backend DB config
import { types } from 'pg';
types.setTypeParser(3802, JSON.parse); // OID 3802 = jsonb
```
This eliminates all manual `JSON.parse()` calls across the codebase.

---

### 6.3 `_prev` Coach MV Structure Doubles Refresh Cost [P1]

The Layer 2 coach directory has both `current/` and `previous/` subdirectories with identical SQL structure:

```
sql/Layer 2/coach/current/zadar/head_coach/all_time/zadar_head_coach_record.sql
sql/Layer 2/coach/previous/zadar/head_coach/all_time/zadar_head_coach_record.sql
```

208 coach SQL files split roughly 50/50 between current and previous. These are refreshed identically, doubling coach-related refresh time. The `_prev` MVs likely represent a snapshot from the prior refresh cycle used to compute rank deltas in the stats service.

This pattern creates a temporal coupling problem: the `_prev` snapshot must be captured before the `current` refresh, meaning refresh ordering matters. If both are refreshed in sequence during a full REFRESH, `_prev` will be overwritten before the rank delta is computed.

**Alternative:** Store historical ranks in a dedicated rank-history table, written to by application code at the end of each refresh cycle. This eliminates the `_prev` MV pattern entirely, cutting the coach MV count roughly in half.

---

### 6.4 `schedule.ts find()` Exposes Full Data Dump [P0]

Restating §4.3 as a security/performance cross-cut: the `schedule` MV includes referee IDs, coach IDs, venue slugs, and all team names. An endpoint that returns this without filtering, caching, or pagination represents both a performance risk (large payload, repeated full scans) and a potential data exposure concern depending on the route's auth config.

Check whether the route for `schedule.find()` has `auth: false` (as all GET routes appear to per CLAUDE.md). If so, this endpoint dumps the full historical game schedule to any unauthenticated caller on every request.

---

## 7. Prioritized Recommendations

### P0 — Fix Immediately

| # | Issue | File | Impact |
|---|-------|------|--------|
| P0.1 | Add MV indexes | All SQL files | Eliminates full seq scans on all filtered MV queries |
| P0.2 | Remove orphaned JOINs from schedule.sql | `sql/Layer 1/schedule.sql:110–112` | Removes unnecessary join overhead on every schedule refresh and DISTINCT deduplication |
| P0.3 | Add caching to entire coach service | `backend/src/api/coach/services/coach.ts` | Eliminates 5–8 live DB queries per coach detail page load |
| P0.4 | Fix or remove `schedule.find()` | `backend/src/api/schedule/services/schedule.ts:4` | Removes unbounded full-table dump endpoint |

### P1 — Fix Before Scale

| # | Issue | File | Impact |
|---|-------|------|--------|
| P1.1 | Enable CONCURRENT refresh | `backend/src/api/refresh/services/refresh.ts:112` | Eliminates exclusive locks during refresh (requires P0.1 first) |
| P1.2 | Move `is_active_player` into MV | `backend/src/api/stats/services/stats.ts:25` | Removes live JOIN on every stats page load |
| P1.3 | Cache game service methods | `backend/src/api/game/services/game.ts` | Removes 4 live DB hits per game detail page |
| P1.4 | Delete duplicate `findPlayersAllTimeStats` | `backend/src/api/player-stats/services/player-stat.ts:10` | Removes dead code with a latent filter bug |
| P1.5 | Fix JSON column types to JSONB | All Layer 3 MV SQL files | Eliminates 15+ manual JSON.parse() calls |
| P1.6 | Consolidate 4× location variant MVs into 1+index | All Layer 2 SQL files | Reduces 463 MVs by ~75%, cuts refresh time proportionally |
| P1.7 | Referee stats should query Layer 1 MVs, not raw tables | `sql/Layer 2/referee/*/referee_stats.sql` | Removes 13-join CTE rebuilt independently per variant |
| P1.8 | Refactor `_prev` pattern | All `previous/` SQL files | Halves coach MV count and refresh time |
| P1.9 | Deduplicate RANK() by computing aggregates once in a CTE | `sql/Layer 2/referee/*/referee_stats.sql`, `sql/Layer 2/player-records/*` | Reduces sort passes from N to 1 per MV |

### P2 — Clean Up

| # | Issue | File | Impact |
|---|-------|------|--------|
| P2.1 | Fix query key collisions (`boxscore`, `season-league-stats`) | Multiple hooks | Prevents silent cache poisoning |
| P2.2 | Add `!!season` to `enabled` guards | `UseSeasonLeagueStats.ts`, `UseSeasonTotalStats.ts` | Prevents spurious 400 errors before season loads |
| P2.3 | Set `staleTime: Infinity` for immutable historical queries | `UsePlayerBoxscore.ts`, `UseAllTimeStats.ts`, `UsePlayerCareerHigh.ts`, etc. | Eliminates pointless background refetches |
| P2.4 | Replace `populate=*` with specific fields | `Routes.ts:59` | Reduces payload size for player/staff detail API |
| P2.5 | Replace `SELECT *` in game service queries | `game.ts:70,80` | Reduces data transfer for score/teamstats queries |
| P2.6 | Verify and fix `useTeamSeasonLeagueStats` route target | `UseTeamSeasonLeagueStats.ts` | Possible functional bug — hook calls wrong endpoint |
| P2.7 | Remove LEFT JOINs on mandatory relations in team_boxscore | `sql/Layer 1/team_boxscore.sql:92–116` | Gives planner freedom to optimize join order |
| P2.8 | Simplify age_decimal computation | `sql/Layer 1/player_boxscore.sql:32` | Minor readability/correctness improvement |

---

## Appendix: File Reference Map

| Area | Files |
|------|-------|
| Layer 1 MVs | `sql/Layer 1/*.sql` (4 files) |
| Layer 2 coach MVs | `sql/Layer 2/coach/**/*.sql` (208 files, current + previous) |
| Layer 2 player MVs | `sql/Layer 2/player-records/**/*.sql` |
| Layer 2 referee MVs | `sql/Layer 2/referee/**/*.sql` (16 files) |
| Layer 2 team MVs | `sql/Layer 2/team/**/*.sql`, `sql/Layer 2/team-records/**/*.sql` |
| Layer 3 consolidation MVs | `sql/Layer 3/**/*.sql` (21 files) |
| Backend stats service | `backend/src/api/stats/services/stats.ts` |
| Backend refresh service | `backend/src/api/refresh/services/refresh.ts` |
| Backend player service | `backend/src/api/player/services/player.ts` |
| Backend coach service | `backend/src/api/coach/services/coach.ts` |
| Backend game service | `backend/src/api/game/services/game.ts` |
| Backend team service | `backend/src/api/team/services/team.ts` |
| Backend schedule service | `backend/src/api/schedule/services/schedule.ts` |
| Backend cache utility | `backend/src/utils/cache.ts` |
| Frontend hooks | `frontend/src/hooks/queries/**/*.ts` (~87 files) |
| Frontend query client | `frontend/src/main.tsx` |
| Frontend routes | `frontend/src/constants/Routes.ts` |
