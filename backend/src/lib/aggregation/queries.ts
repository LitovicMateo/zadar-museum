/**
 * Aggregation query library — Stage 2 of the DB overhaul.
 *
 * All functions accept a Knex instance (strapi.db.connection) so they remain
 * testable without a running Strapi instance. No existing services change here.
 *
 * Key notes from reading the Layer 1 MVs:
 *  - player_boxscore.is_home_team is a STRING: 'home' | 'away' | 'neutral'
 *  - team_boxscore.is_home_team    is a STRING: 'home' | 'away' | 'neutral'
 *  - coach_boxscore.is_home_team   is a BOOLEAN (inherited from team_boxscore via CTE)
 *    Wait — coach_boxscore.sql re-uses team_boxscore.is_home_team which is a string.
 *    Confirmed: it's a string 'home'|'away'|'neutral'.
 *  - player_boxscore already includes is_active_player from the player JOIN in the MV.
 *  - schedule.main_referee_id / second_referee_id / third_referee_id are document_ids.
 *  - schedule.home_team_slug, away_team_slug identify the teams.
 *  - team_boxscore.fouls is available for referee fouls computation.
 */

import type { Knex } from 'knex';
import { getMainTeamSlug } from '../mainTeam';

// ---------------------------------------------------------------------------
// Parameter interfaces
// ---------------------------------------------------------------------------

export interface PlayerStatsParams {
  database: 'main' | 'opponent';
  stats: 'average' | 'total';
  location: 'all' | 'home' | 'away' | 'neutral';
  league?: string;
  season?: string;
  playerId?: string;
  prev?: boolean;
}

export interface PlayerRecordsParams {
  database: 'main' | 'opponent';
  location: 'all' | 'home' | 'away' | 'neutral';
  league?: string;
  season?: string;
  playerId?: string;
}

export interface TeamStatsParams {
  location: 'all' | 'home' | 'away' | 'neutral';
  league?: string;
  season?: string;
  teamSlug?: string;
  excludeMainTeam?: boolean;
}

export interface TeamRecordsParams {
  database?: 'main' | 'opponent';
  location: 'all' | 'home' | 'away' | 'neutral';
  league?: string;
  season?: string;
}

export interface CoachRecordParams {
  coachId?: string;
  database: 'main' | 'opponent';
  role?: 'head' | 'assistant';
  location: 'all' | 'home' | 'away' | 'neutral';
  league?: string;
  season?: string;
  prev?: boolean;
}

export interface RefereeStatsParams {
  refereeId?: string;
  location: 'all' | 'home' | 'away' | 'neutral';
  league?: string;
  season?: string;
}

export interface VenueRecordParams {
  venueSlug?: string;
  location: 'all' | 'home' | 'away' | 'neutral';
  season?: string;
  league?: string;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Runs queryFn for all four location variants in parallel and returns a
 * { total, home, away, neutral } object.
 */
export async function buildRecord<T>(
  queryFn: (location: 'all' | 'home' | 'away' | 'neutral') => Promise<T>,
): Promise<{ total: T; home: T; away: T; neutral: T }> {
  const [total, home, away, neutral] = await Promise.all([
    queryFn('all'),
    queryFn('home'),
    queryFn('away'),
    queryFn('neutral'),
  ]);
  return { total, home, away, neutral };
}

// ---------------------------------------------------------------------------
// 1. aggregatePlayerStats
// ---------------------------------------------------------------------------

/**
 * Aggregated player stats from the player_boxscore MV.
 *
 * Returns one row per player with SUM or ROUND(AVG,1) stat columns and
 * RANK() OVER window functions, mirroring the Layer 2 player MVs.
 *
 * player_boxscore.is_home_team is a string: 'home' | 'away' | 'neutral'
 * player_boxscore.is_active_player is already included in the MV.
 */
export async function aggregatePlayerStats(
  knex: Knex,
  params: PlayerStatsParams,
): Promise<any[]> {
  const mainSlug = await getMainTeamSlug();
  const bindings: Record<string, any> = { mainSlug };

  // -- WHERE clauses built up as fragments
  // Note: forfeited games are intentionally NOT filtered here, matching the
  // Layer 2 main_player_total_all_time MV which also omits a forfeited filter.
  // aggregatePlayerRecords filters forfeited = false because the record MVs do.
  const whereClauses: string[] = [
    `b.status::text <> 'dnp-cd'::text`,
    `b.is_nulled = false`,
  ];

  // database filter
  if (params.database === 'main') {
    whereClauses.push(`b.team_slug = :mainSlug`);
  } else {
    whereClauses.push(`b.team_slug != :mainSlug`);
  }

  // location filter (string column)
  if (params.location !== 'all') {
    whereClauses.push(`b.is_home_team = :location`);
    bindings.location = params.location;
  }

  // optional league filter
  if (params.league && params.league !== 'all') {
    whereClauses.push(`b.league_slug = :league`);
    bindings.league = params.league;
  }

  // optional season filter
  if (params.season && params.season !== 'all') {
    whereClauses.push(`b.season = :season`);
    bindings.season = params.season;
  }

  // optional player filter (profile page)
  if (params.playerId) {
    whereClauses.push(`b.player_id = :playerId`);
    bindings.playerId = params.playerId;
  }

  // prev filter: games before the most recent game date for the main team
  if (params.prev) {
    whereClauses.push(`b.game_date < (
      SELECT MAX(game_date) FROM player_boxscore
      WHERE team_slug = :mainSlug AND is_nulled = false
    )`);
  }

  const whereSQL = whereClauses.join(' AND ');

  // -- stat columns differ by stats mode
  const isAvg = params.stats === 'average';

  const minutesExpr = isAvg
    ? `ROUND(AVG(b.minutes + (b.seconds / 60.0)), 1)`
    : `ROUND(SUM(b.minutes + (b.seconds / 60.0)), 1)`;

  const minutesRankExpr = isAvg
    ? `RANK() OVER (ORDER BY AVG(b.minutes + (b.seconds / 60.0)) DESC NULLS LAST)`
    : `RANK() OVER (ORDER BY SUM(b.minutes + (b.seconds / 60.0)) DESC NULLS LAST)`;

  function statCol(col: string): string {
    return isAvg ? `ROUND(AVG(b.${col}), 1)` : `SUM(b.${col})`;
  }

  function rankCol(col: string, direction: 'DESC' | 'ASC' = 'DESC'): string {
    const aggFn = isAvg ? `AVG(b.${col})` : `SUM(b.${col})`;
    return `RANK() OVER (ORDER BY ${aggFn} ${direction} NULLS LAST)`;
  }

  // percentage columns
  function pctCol(madeCol: string, attCol: string): string {
    if (isAvg) {
      return `CASE WHEN AVG(b.${attCol}) = 0 THEN 0
        ELSE ROUND(AVG(b.${madeCol}) / NULLIF(AVG(b.${attCol}), 0) * 100, 1)
      END`;
    }
    return `CASE WHEN SUM(b.${attCol}) = 0 THEN 0
      ELSE ROUND(SUM(b.${madeCol})::numeric / NULLIF(SUM(b.${attCol}), 0) * 100, 1)
    END`;
  }

  function pctRankCol(madeCol: string, attCol: string): string {
    const expr = isAvg
      ? `CASE WHEN AVG(b.${attCol}) = 0 THEN 0 ELSE ROUND(AVG(b.${madeCol}) / NULLIF(AVG(b.${attCol}), 0) * 100, 1) END`
      : `CASE WHEN SUM(b.${attCol}) = 0 THEN 0 ELSE ROUND(SUM(b.${madeCol})::numeric / NULLIF(SUM(b.${attCol}), 0) * 100, 1) END`;
    return `RANK() OVER (ORDER BY ${expr} DESC NULLS LAST)`;
  }

  const sql = `
    SELECT
      b.player_id,
      b.first_name,
      b.last_name,
      BOOL_OR(b.is_active_player) AS is_active_player,

      COUNT(b.game_id) AS games,
      RANK() OVER (ORDER BY COUNT(b.game_id) DESC NULLS LAST) AS games_rank,
      SUM(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END) AS games_started,
      RANK() OVER (ORDER BY SUM(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END) DESC NULLS LAST) AS games_started_rank,

      ${minutesExpr} AS minutes,
      ${minutesRankExpr} AS minutes_rank,

      ${statCol('points')} AS points,
      ${rankCol('points')} AS points_rank,

      ${statCol('assists')} AS assists,
      ${rankCol('assists')} AS assists_rank,

      ${statCol('offensive_rebounds')} AS off_rebounds,
      ${rankCol('offensive_rebounds')} AS off_rebounds_rank,

      ${statCol('defensive_rebounds')} AS def_rebounds,
      ${rankCol('defensive_rebounds')} AS def_rebounds_rank,

      ${statCol('rebounds')} AS rebounds,
      ${rankCol('rebounds')} AS rebounds_rank,

      ${statCol('steals')} AS steals,
      ${rankCol('steals')} AS steals_rank,

      ${statCol('blocks')} AS blocks,
      ${rankCol('blocks')} AS blocks_rank,

      ${statCol('field_goals_made')} AS field_goals_made,
      ${rankCol('field_goals_made')} AS field_goals_made_rank,

      ${statCol('field_goals_attempted')} AS field_goals_attempted,
      ${rankCol('field_goals_attempted')} AS field_goals_attempted_rank,

      ${pctCol('field_goals_made', 'field_goals_attempted')} AS field_goal_percentage,
      ${pctRankCol('field_goals_made', 'field_goals_attempted')} AS field_goal_percentage_rank,

      ${statCol('three_pointers_made')} AS three_pointers_made,
      ${rankCol('three_pointers_made')} AS three_pointers_made_rank,

      ${statCol('three_pointers_attempted')} AS three_pointers_attempted,
      ${rankCol('three_pointers_attempted')} AS three_pointers_attempted_rank,

      ${pctCol('three_pointers_made', 'three_pointers_attempted')} AS three_point_percentage,
      ${pctRankCol('three_pointers_made', 'three_pointers_attempted')} AS three_point_percentage_rank,

      ${statCol('free_throws_made')} AS free_throws_made,
      ${rankCol('free_throws_made')} AS free_throws_made_rank,

      ${statCol('free_throws_attempted')} AS free_throws_attempted,
      ${rankCol('free_throws_attempted')} AS free_throws_attempted_rank,

      ${pctCol('free_throws_made', 'free_throws_attempted')} AS free_throw_percentage,
      ${pctRankCol('free_throws_made', 'free_throws_attempted')} AS free_throw_percentage_rank,

      ${statCol('efficiency')} AS efficiency,
      ${rankCol('efficiency')} AS efficiency_rank

    FROM player_boxscore b
    WHERE ${whereSQL}
    GROUP BY b.player_id, b.first_name, b.last_name
  `;

  const result = await knex.raw(sql, bindings);
  return result.rows;
}

// ---------------------------------------------------------------------------
// 2. aggregatePlayerRecords
//    Returns per-game record rows (mirrors main_player_record MV).
// ---------------------------------------------------------------------------

/**
 * Per-game record rows from player_boxscore, with RANK() OVER window functions
 * for each stat. Mirrors the main_player_record / opponent_player_record MVs.
 *
 * Note: player_boxscore.is_home_team is a string: 'home'|'away'|'neutral'.
 * The MV also includes is_active_player already.
 */
export async function aggregatePlayerRecords(
  knex: Knex,
  params: PlayerRecordsParams,
): Promise<any[]> {
  const mainSlug = await getMainTeamSlug();
  const bindings: Record<string, any> = { mainSlug };

  const whereClauses: string[] = [
    `b.status::text <> 'dnp-cd'::text`,
    `b.is_nulled = false`,
    `b.forfeited = false`,
  ];

  if (params.database === 'main') {
    whereClauses.push(`b.team_slug = :mainSlug`);
  } else {
    whereClauses.push(`b.team_slug != :mainSlug`);
  }

  if (params.location !== 'all') {
    whereClauses.push(`b.is_home_team = :location`);
    bindings.location = params.location;
  }

  if (params.league && params.league !== 'all') {
    whereClauses.push(`b.league_slug = :league`);
    bindings.league = params.league;
  }

  if (params.season && params.season !== 'all') {
    whereClauses.push(`b.season = :season`);
    bindings.season = params.season;
  }

  if (params.playerId) {
    whereClauses.push(`b.player_id = :playerId`);
    bindings.playerId = params.playerId;
  }

  const whereSQL = whereClauses.join(' AND ');

  const sql = `
    SELECT
      b.id,
      b.document_id,
      b.game_id,
      b.season,
      b.game_date,
      b.game_stage,
      b.game_round,
      b.league_id,
      b.league_slug,
      b.player_id,
      b.first_name,
      b.last_name,
      b.captain,
      b.position,
      b.secondary_position,
      b.shirt_number,
      b.age_decimal,
      b.player_team_document_id,
      b.team_name,
      b.team_slug,
      b.team_short_name,
      b.is_home_team,
      b.opponent_team_id,
      b.opponent_team_document_id,
      b.opponent_team_name,
      b.opponent_team_short_name,
      b.opponent_team_slug,
      b.is_active_player,
      b.status,
      b.minutes,
      b.seconds,
      CASE WHEN b.minutes IS NULL THEN NULL
           ELSE (b.minutes::numeric + COALESCE(b.seconds, 0)::numeric / 60.0)
      END AS minutes_decimal,
      RANK() OVER (ORDER BY CASE WHEN b.minutes IS NULL THEN NULL ELSE (b.minutes::numeric + COALESCE(b.seconds, 0)::numeric / 60.0) END DESC NULLS LAST) AS minutes_rank,
      b.points,
      RANK() OVER (ORDER BY b.points DESC NULLS LAST) AS points_rank,
      b.field_goals_made,
      RANK() OVER (ORDER BY b.field_goals_made DESC NULLS LAST) AS field_goals_made_rank,
      b.field_goals_attempted,
      RANK() OVER (ORDER BY b.field_goals_attempted DESC NULLS LAST) AS field_goals_attempted_rank,
      b.field_goals_percentage,
      b.three_pointers_made,
      RANK() OVER (ORDER BY b.three_pointers_made DESC NULLS LAST) AS three_pointers_made_rank,
      b.three_pointers_attempted,
      RANK() OVER (ORDER BY b.three_pointers_attempted DESC NULLS LAST) AS three_pointers_attempted_rank,
      b.three_point_percentage,
      b.free_throws_made,
      RANK() OVER (ORDER BY b.free_throws_made DESC NULLS LAST) AS free_throws_made_rank,
      b.free_throws_attempted,
      RANK() OVER (ORDER BY b.free_throws_attempted DESC NULLS LAST) AS free_throws_attempted_rank,
      b.free_throws_percentage,
      b.rebounds,
      RANK() OVER (ORDER BY b.rebounds DESC NULLS LAST) AS rebounds_rank,
      b.offensive_rebounds,
      RANK() OVER (ORDER BY b.offensive_rebounds DESC NULLS LAST) AS offensive_rebounds_rank,
      b.defensive_rebounds,
      RANK() OVER (ORDER BY b.defensive_rebounds DESC NULLS LAST) AS defensive_rebounds_rank,
      b.assists,
      RANK() OVER (ORDER BY b.assists DESC NULLS LAST) AS assists_rank,
      b.turnovers,
      RANK() OVER (ORDER BY b.turnovers DESC NULLS LAST) AS turnovers_rank,
      b.steals,
      RANK() OVER (ORDER BY b.steals DESC NULLS LAST) AS steals_rank,
      b.blocks,
      RANK() OVER (ORDER BY b.blocks DESC NULLS LAST) AS blocks_rank,
      b.fouls,
      RANK() OVER (ORDER BY b.fouls DESC NULLS LAST) AS fouls_rank,
      b.fouls_on,
      RANK() OVER (ORDER BY b.fouls_on DESC NULLS LAST) AS fouls_on_rank,
      b.blocks_received,
      RANK() OVER (ORDER BY b.blocks_received DESC NULLS LAST) AS blocks_received_rank,
      b.plus_minus,
      RANK() OVER (ORDER BY b.plus_minus DESC NULLS LAST) AS plus_minus_rank,
      b.efficiency,
      RANK() OVER (ORDER BY b.efficiency DESC NULLS LAST) AS efficiency_rank
    FROM player_boxscore b
    WHERE ${whereSQL}
  `;

  const result = await knex.raw(sql, bindings);
  return result.rows;
}

// ---------------------------------------------------------------------------
// 3. aggregateTeamStats
// ---------------------------------------------------------------------------

/**
 * Aggregated team stats from the schedule MV (via a home+away UNION CTE).
 * Mirrors the team_average_stats family of MVs.
 *
 * The excludeMainTeam flag: when true, ranks are computed on the set that
 * excludes the main team, and the main team row gets NULL ranks — matching
 * the current MV behaviour exactly.
 *
 * Location: the schedule CTE assigns 'home'/'away'/'neutral' per perspective.
 */
export async function aggregateTeamStats(
  knex: Knex,
  params: TeamStatsParams,
): Promise<any[]> {
  const mainSlug = await getMainTeamSlug();
  const bindings: Record<string, any> = { mainSlug };

  // Build optional WHERE additions for the `all_games` CTE
  const allGamesWhere: string[] = [];

  if (params.league && params.league !== 'all') {
    allGamesWhere.push(`s.league_slug = :league`);
    bindings.league = params.league;
  }

  if (params.season && params.season !== 'all') {
    allGamesWhere.push(`s.season = :season`);
    bindings.season = params.season;
  }

  const allGamesWhereSQL = allGamesWhere.length
    ? `AND ${allGamesWhere.join(' AND ')}`
    : '';

  // Location filter on the `agg` CTE
  const locationFilter =
    params.location !== 'all' ? `AND venue = :location` : '';
  if (params.location !== 'all') {
    bindings.location = params.location;
  }

  // teamSlug filter (for team profile pages)
  const teamFilter = params.teamSlug ? `AND team_slug = :teamSlug` : '';
  if (params.teamSlug) {
    bindings.teamSlug = params.teamSlug;
  }

  const mainTeamExclude = params.excludeMainTeam ?? true;

  const sql = `
    WITH all_games AS (
      SELECT
        s.home_team_document_id AS team_id,
        s.home_team_name AS team_name,
        s.home_team_slug AS team_slug,
        s.game_id,
        s.forfeited,
        s.forfeited_by,
        s.is_nulled,
        s.attendance,
        CASE WHEN s.is_neutral THEN 'neutral' ELSE 'home' END AS venue,
        s.home_score AS points_scored,
        s.away_score AS points_allowed,
        s.home_score - s.away_score AS points_diff
      FROM schedule s
      WHERE s.home_score IS NOT NULL
        AND s.away_score IS NOT NULL
        AND s.is_nulled IS NOT TRUE
        ${allGamesWhereSQL}

      UNION ALL

      SELECT
        s.away_team_document_id AS team_id,
        s.away_team_name AS team_name,
        s.away_team_slug AS team_slug,
        s.game_id,
        s.forfeited,
        s.forfeited_by,
        s.is_nulled,
        s.attendance,
        CASE WHEN s.is_neutral THEN 'neutral' ELSE 'away' END AS venue,
        s.away_score AS points_scored,
        s.home_score AS points_allowed,
        s.away_score - s.home_score AS points_diff
      FROM schedule s
      WHERE s.home_score IS NOT NULL
        AND s.away_score IS NOT NULL
        AND s.is_nulled IS NOT TRUE
        ${allGamesWhereSQL}
    ),
    agg AS (
      SELECT
        team_id,
        MAX(team_name) AS team_name,
        team_slug,
        COUNT(*) AS games,
        SUM(
          CASE
            WHEN forfeited AND forfeited_by = 'home' AND venue = 'away' THEN 1
            WHEN forfeited AND forfeited_by = 'away' AND venue = 'home' THEN 1
            WHEN NOT forfeited AND points_scored > points_allowed THEN 1
            ELSE 0
          END
        ) AS wins,
        SUM(
          CASE
            WHEN forfeited AND forfeited_by = 'home' AND venue = 'home' THEN 1
            WHEN forfeited AND forfeited_by = 'away' AND venue = 'away' THEN 1
            WHEN NOT forfeited AND points_scored < points_allowed THEN 1
            ELSE 0
          END
        ) AS losses,
        ROUND(
          100.0 * SUM(
            CASE
              WHEN forfeited AND forfeited_by = 'home' AND venue = 'away' THEN 1
              WHEN forfeited AND forfeited_by = 'away' AND venue = 'home' THEN 1
              WHEN NOT forfeited AND points_scored > points_allowed THEN 1
              ELSE 0
            END
          )::numeric / NULLIF(COUNT(*), 0)::numeric,
          1
        ) AS win_pct,
        ROUND(AVG(points_scored)  FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_scored,
        ROUND(AVG(points_allowed) FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_received,
        ROUND(AVG(points_diff)    FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_diff,
        ROUND(AVG(NULLIF(attendance::text, '')::numeric), 0) AS attendance
      FROM all_games
      WHERE TRUE ${locationFilter} ${teamFilter}
      GROUP BY team_id, team_slug
    ),
    agg_no_main AS (
      SELECT * FROM agg WHERE team_slug <> :mainSlug
    ),
    ranks AS (
      SELECT
        team_id,
        RANK() OVER (ORDER BY games DESC)           AS games_rank,
        RANK() OVER (ORDER BY wins DESC)            AS wins_rank,
        RANK() OVER (ORDER BY losses DESC)          AS losses_rank,
        RANK() OVER (ORDER BY points_scored DESC)   AS points_scored_rank,
        RANK() OVER (ORDER BY points_received DESC) AS points_received_rank,
        RANK() OVER (ORDER BY points_diff DESC)     AS points_diff_rank,
        RANK() OVER (ORDER BY attendance DESC)      AS attendance_rank
      FROM ${mainTeamExclude ? 'agg_no_main' : 'agg'}
    )
    SELECT
      a.team_id,
      a.team_name,
      a.team_slug,
      a.games,
      r.games_rank,
      a.wins,
      r.wins_rank,
      a.losses,
      r.losses_rank,
      a.win_pct,
      a.points_scored,
      r.points_scored_rank,
      a.points_received,
      r.points_received_rank,
      a.points_diff,
      r.points_diff_rank,
      a.attendance,
      r.attendance_rank
    FROM agg a
    LEFT JOIN ranks r USING (team_id)
    ORDER BY a.games DESC
  `;

  const result = await knex.raw(sql, bindings);
  return result.rows;
}

// ---------------------------------------------------------------------------
// 4. aggregateTeamRecords
//    Per-game records from team_boxscore (mirrors main_team_record MV).
// ---------------------------------------------------------------------------

/**
 * Per-game record rows for the main team from team_boxscore MV.
 * Uses main team as the base, self-joins for opponent info.
 *
 * team_boxscore.is_home_team is a STRING: 'home' | 'away' | 'neutral'
 */
export async function aggregateTeamRecords(
  knex: Knex,
  params: TeamRecordsParams,
): Promise<any[]> {
  const mainSlug = await getMainTeamSlug();
  const bindings: Record<string, any> = { mainSlug };

  const isOpponent = params.database === 'opponent';
  const whereClauses: string[] = [
    `tb.is_nulled = false`,
    `tb.forfeited = false`,
    isOpponent ? `tb.team_slug != :mainSlug` : `tb.team_slug = :mainSlug`,
  ];

  if (params.location !== 'all') {
    whereClauses.push(`tb.is_home_team = :location`);
    bindings.location = params.location;
  }

  if (params.league && params.league !== 'all') {
    whereClauses.push(`tb.league_slug = :league`);
    bindings.league = params.league;
  }

  if (params.season && params.season !== 'all') {
    whereClauses.push(`tb.season = :season`);
    bindings.season = params.season;
  }

  const whereSQL = whereClauses.join(' AND ');

  const sql = `
    SELECT
      tb.id,
      tb.game_id,
      tb.season,
      tb.stage,
      tb.round,
      tb.game_date,
      tb.is_nulled,
      tb.forfeited,
      tb.forfeited_by,
      tb.league_id,
      tb.league_name,
      tb.league_short_name,
      tb.league_slug,
      tb.team_id,
      tb.team_name,
      tb.team_short_name,
      tb.team_slug,
      otb.team_id AS opponent_team_id,
      otb.team_name AS opponent_team_name,
      otb.team_short_name AS opponent_team_short_name,
      otb.team_slug AS opponent_team_slug,
      tb.is_home_team,
      tb.head_coach_id,
      tb.head_coach_first_name,
      tb.head_coach_last_name,
      tb.assistant_coach_id,
      tb.assistant_coach_first_name,
      tb.assistant_coach_last_name,
      tb.first_quarter,
      RANK() OVER (ORDER BY tb.first_quarter DESC NULLS LAST) AS first_quarter_rank,
      tb.second_quarter,
      RANK() OVER (ORDER BY tb.second_quarter DESC NULLS LAST) AS second_quarter_rank,
      tb.third_quarter,
      RANK() OVER (ORDER BY tb.third_quarter DESC NULLS LAST) AS third_quarter_rank,
      tb.fourth_quarter,
      RANK() OVER (ORDER BY tb.fourth_quarter DESC NULLS LAST) AS fourth_quarter_rank,
      tb.overtime,
      RANK() OVER (ORDER BY tb.overtime DESC NULLS LAST) AS overtime_rank,
      tb.score,
      RANK() OVER (ORDER BY tb.score DESC NULLS LAST) AS score_rank,
      otb.score AS opponent_score,
      RANK() OVER (ORDER BY otb.score ASC NULLS LAST) AS opponent_score_rank,
      tb.score - otb.score AS score_diff,
      RANK() OVER (ORDER BY (tb.score - otb.score) DESC NULLS LAST) AS score_diff_rank,
      tb.field_goals_made,
      RANK() OVER (ORDER BY tb.field_goals_made DESC NULLS LAST) AS field_goals_made_rank,
      tb.field_goals_attempted,
      RANK() OVER (ORDER BY tb.field_goals_attempted DESC NULLS LAST) AS field_goals_attempted_rank,
      tb.field_goals_percentage,
      tb.three_pointers_made,
      RANK() OVER (ORDER BY tb.three_pointers_made DESC NULLS LAST) AS three_pointers_made_rank,
      tb.three_pointers_attempted,
      RANK() OVER (ORDER BY tb.three_pointers_attempted DESC NULLS LAST) AS three_pointers_attempted_rank,
      tb.three_pointers_percentage,
      tb.free_throws_made,
      RANK() OVER (ORDER BY tb.free_throws_made DESC NULLS LAST) AS free_throws_made_rank,
      tb.free_throws_attempted,
      RANK() OVER (ORDER BY tb.free_throws_attempted DESC NULLS LAST) AS free_throws_attempted_rank,
      tb.free_throws_percentage,
      tb.offensive_rebounds,
      RANK() OVER (ORDER BY tb.offensive_rebounds DESC NULLS LAST) AS offensive_rebounds_rank,
      tb.defensive_rebounds,
      RANK() OVER (ORDER BY tb.defensive_rebounds DESC NULLS LAST) AS defensive_rebounds_rank,
      tb.rebounds,
      RANK() OVER (ORDER BY tb.rebounds DESC NULLS LAST) AS rebounds_rank,
      tb.assists,
      RANK() OVER (ORDER BY tb.assists DESC NULLS LAST) AS assists_rank,
      tb.turnovers,
      RANK() OVER (ORDER BY tb.turnovers DESC NULLS LAST) AS turnovers_rank,
      tb.blocks,
      RANK() OVER (ORDER BY tb.blocks DESC NULLS LAST) AS blocks_rank,
      tb.steals,
      RANK() OVER (ORDER BY tb.steals DESC NULLS LAST) AS steals_rank,
      tb.fouls,
      RANK() OVER (ORDER BY tb.fouls DESC NULLS LAST) AS fouls_rank
    FROM team_boxscore tb
    LEFT JOIN team_boxscore otb
      ON tb.game_id = otb.game_id AND tb.team_id != otb.team_id
    WHERE ${whereSQL}
  `;

  const result = await knex.raw(sql, bindings);
  return result.rows;
}

// ---------------------------------------------------------------------------
// 5. aggregateCoachRecord
// ---------------------------------------------------------------------------

/**
 * Aggregated coach win/loss record from coach_boxscore MV.
 * Mirrors the main_coach_record / opponent_coach_record family of MVs.
 *
 * coach_boxscore.is_home_team is inherited from team_boxscore — a STRING:
 * 'home' | 'away' | 'neutral'
 */
export async function aggregateCoachRecord(
  knex: Knex,
  params: CoachRecordParams,
): Promise<any[]> {
  const mainSlug = await getMainTeamSlug();
  const bindings: Record<string, any> = { mainSlug };

  const whereClauses: string[] = [
    `cb.is_nulled = false`,
  ];

  // database filter
  if (params.database === 'main') {
    whereClauses.push(`cb.team_slug = :mainSlug`);
  } else {
    whereClauses.push(`cb.team_slug != :mainSlug`);
  }

  // role filter
  if (params.role) {
    whereClauses.push(`cb.coach_role = :role`);
    bindings.role = params.role;
  }

  // location filter (string column)
  if (params.location !== 'all') {
    whereClauses.push(`cb.is_home_team = :location`);
    bindings.location = params.location;
  }

  // league filter
  if (params.league && params.league !== 'all') {
    whereClauses.push(`cb.league_slug = :league`);
    bindings.league = params.league;
  }

  // season filter
  if (params.season && params.season !== 'all') {
    whereClauses.push(`cb.season = :season`);
    bindings.season = params.season;
  }

  // coachId filter
  if (params.coachId) {
    whereClauses.push(`cb.coach_id = :coachId`);
    bindings.coachId = params.coachId;
  }

  // prev filter: games before the most recent game for the main team
  if (params.prev) {
    whereClauses.push(`cb.game_date < (
      SELECT MAX(game_date) FROM coach_boxscore
      WHERE team_slug = :mainSlug AND is_nulled = false
    )`);
  }

  const whereSQL = whereClauses.join(' AND ');

  const sql = `
    SELECT
      cb.coach_id,
      cb.first_name,
      cb.last_name,

      COUNT(*) AS games,
      RANK() OVER (ORDER BY COUNT(*) DESC NULLS LAST) AS games_rank,

      SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END) AS wins,
      RANK() OVER (ORDER BY SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END) DESC NULLS LAST) AS wins_rank,

      SUM(CASE WHEN cb.team_score < cb.opponent_score THEN 1 ELSE 0 END) AS losses,
      RANK() OVER (ORDER BY SUM(CASE WHEN cb.team_score < cb.opponent_score THEN 1 ELSE 0 END) DESC NULLS LAST) AS losses_rank,

      ROUND(
        SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END)::numeric
        / NULLIF(COUNT(*), 0) * 100,
        1
      ) AS win_percentage,

      ROUND(AVG(cb.team_score)    FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_scored,
      RANK() OVER (ORDER BY AVG(cb.team_score) DESC NULLS LAST) AS points_scored_rank,

      ROUND(AVG(cb.opponent_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_received,
      RANK() OVER (ORDER BY AVG(cb.opponent_score) DESC NULLS LAST) AS points_received_rank,

      ROUND(AVG(cb.team_score - cb.opponent_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_difference,
      RANK() OVER (ORDER BY AVG(cb.team_score - cb.opponent_score) DESC NULLS LAST) AS points_difference_rank

    FROM coach_boxscore cb
    WHERE ${whereSQL}
    GROUP BY cb.coach_id, cb.first_name, cb.last_name
    ORDER BY COUNT(*) DESC
  `;

  const result = await knex.raw(sql, bindings);
  return result.rows;
}

// ---------------------------------------------------------------------------
// 6. aggregateRefereeStats
// ---------------------------------------------------------------------------

/**
 * Referee stats from schedule + team_boxscore MVs.
 * Replaces the Layer 2 referee MVs which queried raw Strapi tables.
 *
 * schedule.main_referee_id / second_referee_id / third_referee_id are
 * document_ids (confirmed from schedule.sql).
 *
 * We resolve fouls by joining team_boxscore for main team and opponent
 * separately, then determine fouls_for / fouls_against based on which
 * side is the main team.
 */
export async function aggregateRefereeStats(
  knex: Knex,
  params: RefereeStatsParams,
): Promise<any[]> {
  const mainSlug = await getMainTeamSlug();
  const bindings: Record<string, any> = { mainSlug };

  // Optional filters on the ref_games CTE
  const refGamesWhere: string[] = [];

  if (params.league && params.league !== 'all') {
    refGamesWhere.push(`s.league_slug = :league`);
    bindings.league = params.league;
  }

  if (params.season && params.season !== 'all') {
    refGamesWhere.push(`s.season = :season`);
    bindings.season = params.season;
  }

  const refGamesWhereSQL = refGamesWhere.length
    ? `AND ${refGamesWhere.join(' AND ')}`
    : '';

  // Location filter applied in the ref_game_union expansion
  // schedule has is_neutral; we derive the main team's venue per game
  let locationFilter = '';
  if (params.location === 'home') {
    // main team was home team and game was not neutral
    locationFilter = `AND (
      (s.home_team_slug = :mainSlug AND NOT s.is_neutral)
    )`;
  } else if (params.location === 'away') {
    locationFilter = `AND (
      (s.away_team_slug = :mainSlug AND NOT s.is_neutral)
    )`;
  } else if (params.location === 'neutral') {
    locationFilter = `AND s.is_neutral = true`;
  }

  // Referee filter — applied inside ref_game_union so the WHERE sits correctly
  // before the GROUP BY (never interpolated after a JOIN). Each branch must
  // filter on its own underlying column — "ref_id" is only an alias created
  // by the SELECT, so it isn't visible yet in that branch's WHERE clause.
  const mainRefFilterSQL = params.refereeId ? `AND main_referee_id = :refereeId` : '';
  const secondRefFilterSQL = params.refereeId ? `AND second_referee_id = :refereeId` : '';
  const thirdRefFilterSQL = params.refereeId ? `AND third_referee_id = :refereeId` : '';
  if (params.refereeId) {
    bindings.refereeId = params.refereeId;
  }

  const sql = `
    WITH ref_games AS (
      SELECT
        s.game_id,
        s.league_id,
        s.league_slug,
        s.season,
        s.is_neutral,
        s.home_team_slug,
        s.away_team_slug,
        s.home_score,
        s.away_score,
        s.main_referee_id,
        s.second_referee_id,
        s.third_referee_id,
        main_tb.fouls AS main_fouls,
        opp_tb.fouls AS opp_fouls
      FROM schedule s
      JOIN team_boxscore main_tb
        ON main_tb.game_id = s.game_document_id AND main_tb.team_slug = :mainSlug
      JOIN team_boxscore opp_tb
        ON opp_tb.game_id = s.game_document_id AND opp_tb.team_slug != :mainSlug
      WHERE
        (s.home_team_slug = :mainSlug OR s.away_team_slug = :mainSlug)
        AND s.is_nulled = false
        AND s.forfeited = false
        AND s.home_score IS NOT NULL
        AND s.away_score IS NOT NULL
        ${refGamesWhereSQL}
        ${locationFilter}
    ),
    ref_game_union AS (
      SELECT game_id, league_id, league_slug, season, is_neutral,
             home_team_slug, away_team_slug, home_score, away_score,
             main_fouls, opp_fouls,
             main_referee_id AS ref_id
      FROM ref_games WHERE main_referee_id IS NOT NULL ${mainRefFilterSQL}

      UNION ALL

      SELECT game_id, league_id, league_slug, season, is_neutral,
             home_team_slug, away_team_slug, home_score, away_score,
             main_fouls, opp_fouls,
             second_referee_id AS ref_id
      FROM ref_games WHERE second_referee_id IS NOT NULL ${secondRefFilterSQL}

      UNION ALL

      SELECT game_id, league_id, league_slug, season, is_neutral,
             home_team_slug, away_team_slug, home_score, away_score,
             main_fouls, opp_fouls,
             third_referee_id AS ref_id
      FROM ref_games WHERE third_referee_id IS NOT NULL ${thirdRefFilterSQL}
    )
    SELECT
      r.document_id AS referee_id,
      r.first_name,
      r.last_name,

      COUNT(DISTINCT u.game_id) AS games,
      RANK() OVER (ORDER BY COUNT(DISTINCT u.game_id) DESC NULLS LAST) AS games_rank,

      SUM(
        CASE
          WHEN u.home_team_slug = :mainSlug AND u.home_score > u.away_score THEN 1
          WHEN u.away_team_slug = :mainSlug AND u.away_score > u.home_score THEN 1
          ELSE 0
        END
      ) AS wins,
      RANK() OVER (ORDER BY SUM(
        CASE
          WHEN u.home_team_slug = :mainSlug AND u.home_score > u.away_score THEN 1
          WHEN u.away_team_slug = :mainSlug AND u.away_score > u.home_score THEN 1
          ELSE 0
        END
      ) DESC NULLS LAST) AS wins_rank,

      SUM(
        CASE
          WHEN u.home_team_slug = :mainSlug AND u.home_score < u.away_score THEN 1
          WHEN u.away_team_slug = :mainSlug AND u.away_score < u.home_score THEN 1
          ELSE 0
        END
      ) AS losses,
      RANK() OVER (ORDER BY SUM(
        CASE
          WHEN u.home_team_slug = :mainSlug AND u.home_score < u.away_score THEN 1
          WHEN u.away_team_slug = :mainSlug AND u.away_score < u.home_score THEN 1
          ELSE 0
        END
      ) DESC NULLS LAST) AS losses_rank,

      ROUND(
        100.0 * SUM(
          CASE
            WHEN u.home_team_slug = :mainSlug AND u.home_score > u.away_score THEN 1
            WHEN u.away_team_slug = :mainSlug AND u.away_score > u.home_score THEN 1
            ELSE 0
          END
        )::numeric / NULLIF(COUNT(DISTINCT u.game_id), 0)::numeric,
        1
      ) AS win_percentage,

      ROUND(AVG(u.main_fouls), 1) AS fouls_for,
      RANK() OVER (ORDER BY AVG(u.main_fouls) DESC NULLS LAST) AS fouls_for_rank,

      ROUND(AVG(u.opp_fouls), 1) AS fouls_against,
      RANK() OVER (ORDER BY AVG(u.opp_fouls) DESC NULLS LAST) AS fouls_against_rank,

      ROUND(AVG(u.main_fouls - u.opp_fouls), 1) AS foul_difference,
      RANK() OVER (ORDER BY AVG(u.main_fouls - u.opp_fouls) DESC NULLS LAST) AS foul_difference_rank

    FROM ref_game_union u
    JOIN referees r ON r.document_id = u.ref_id
    GROUP BY r.document_id, r.first_name, r.last_name
    ORDER BY COUNT(DISTINCT u.game_id) DESC
  `;

  const result = await knex.raw(sql, bindings);
  return result.rows;
}

// ---------------------------------------------------------------------------
// 7a. listMainTeamPlayers / listMainTeamCoaches
//     Lightweight roster lists for the player/coach comparison picker.
// ---------------------------------------------------------------------------

export async function listMainTeamPlayers(
  knex: Knex,
): Promise<{ player_id: string; first_name: string; last_name: string; image_url: string | null }[]> {
  const mainSlug = await getMainTeamSlug();
  const result = await knex.raw(
    `
    SELECT roster.player_id, roster.first_name, roster.last_name, f.url AS image_url
    FROM (
      SELECT DISTINCT player_id, first_name, last_name
      FROM player_boxscore
      WHERE team_slug = :mainSlug AND is_nulled = false
    ) roster
    LEFT JOIN players p ON p.document_id = roster.player_id
    LEFT JOIN files_related_mph m ON m.related_id = p.id AND m.related_type = 'api::player.player' AND m.field = 'image'
    LEFT JOIN files f ON f.id = m.file_id
    ORDER BY roster.last_name, roster.first_name
  `,
    { mainSlug },
  );
  return result.rows;
}

export async function listMainTeamCoaches(
  knex: Knex,
): Promise<{ coach_id: string; first_name: string; last_name: string; image_url: string | null }[]> {
  const mainSlug = await getMainTeamSlug();
  const result = await knex.raw(
    `
    SELECT roster.coach_id, roster.first_name, roster.last_name, f.url AS image_url
    FROM (
      SELECT DISTINCT coach_id, first_name, last_name
      FROM coach_boxscore
      WHERE team_slug = :mainSlug AND is_nulled = false
    ) roster
    LEFT JOIN coaches c ON c.document_id = roster.coach_id
    LEFT JOIN files_related_mph m ON m.related_id = c.id AND m.related_type = 'api::coach.coach' AND m.field = 'image'
    LEFT JOIN files f ON f.id = m.file_id
    ORDER BY roster.last_name, roster.first_name
  `,
    { mainSlug },
  );
  return result.rows;
}

// ---------------------------------------------------------------------------
// 7. aggregateVenueRecord
// ---------------------------------------------------------------------------

/**
 * Venue win/loss record from the schedule MV.
 * Mirrors the main_venue_record / main_venue_season_record family.
 *
 * Location filter uses is_neutral + home/away team slug comparisons.
 */
export async function aggregateVenueRecord(
  knex: Knex,
  params: VenueRecordParams,
): Promise<any[]> {
  const mainSlug = await getMainTeamSlug();
  const bindings: Record<string, any> = { mainSlug };

  const whereClauses: string[] = [
    `(s.home_team_slug = :mainSlug OR s.away_team_slug = :mainSlug)`,
    `s.home_score IS NOT NULL`,
    `s.away_score IS NOT NULL`,
    `s.is_nulled IS NOT TRUE`,
  ];

  // location filter
  if (params.location === 'home') {
    whereClauses.push(`s.home_team_slug = :mainSlug AND s.is_neutral = false`);
  } else if (params.location === 'away') {
    whereClauses.push(`s.away_team_slug = :mainSlug AND s.is_neutral = false`);
  } else if (params.location === 'neutral') {
    whereClauses.push(`s.is_neutral = true`);
  }

  if (params.venueSlug) {
    whereClauses.push(`s.venue_slug = :venueSlug`);
    bindings.venueSlug = params.venueSlug;
  }

  if (params.season && params.season !== 'all') {
    whereClauses.push(`s.season = :season`);
    bindings.season = params.season;
  }

  if (params.league && params.league !== 'all') {
    whereClauses.push(`s.league_slug = :league`);
    bindings.league = params.league;
  }

  const whereSQL = whereClauses.join(' AND ');

  const sql = `
    SELECT
      s.venue_name,
      s.venue_slug,
      s.venue_city,

      COUNT(*) AS games,
      RANK() OVER (ORDER BY COUNT(*) DESC NULLS LAST) AS games_rank,

      SUM(
        CASE
          WHEN s.home_team_slug = :mainSlug AND s.home_score > s.away_score THEN 1
          WHEN s.away_team_slug = :mainSlug AND s.away_score > s.home_score THEN 1
          ELSE 0
        END
      ) AS wins,
      RANK() OVER (ORDER BY SUM(
        CASE
          WHEN s.home_team_slug = :mainSlug AND s.home_score > s.away_score THEN 1
          WHEN s.away_team_slug = :mainSlug AND s.away_score > s.home_score THEN 1
          ELSE 0
        END
      ) DESC NULLS LAST) AS wins_rank,

      SUM(
        CASE
          WHEN s.home_team_slug = :mainSlug AND s.home_score < s.away_score THEN 1
          WHEN s.away_team_slug = :mainSlug AND s.away_score < s.home_score THEN 1
          ELSE 0
        END
      ) AS losses,
      RANK() OVER (ORDER BY SUM(
        CASE
          WHEN s.home_team_slug = :mainSlug AND s.home_score < s.away_score THEN 1
          WHEN s.away_team_slug = :mainSlug AND s.away_score < s.home_score THEN 1
          ELSE 0
        END
      ) DESC NULLS LAST) AS losses_rank,

      ROUND(
        SUM(
          CASE
            WHEN s.home_team_slug = :mainSlug AND s.home_score > s.away_score THEN 1
            WHEN s.away_team_slug = :mainSlug AND s.away_score > s.home_score THEN 1
            ELSE 0
          END
        )::decimal / NULLIF(COUNT(*), 0) * 100,
        1
      ) AS win_percentage,

      ROUND(AVG(NULLIF(s.attendance::text, '')::numeric), 0) AS avg_attendance,
      RANK() OVER (ORDER BY AVG(NULLIF(s.attendance::text, '')::numeric) DESC NULLS LAST) AS avg_attendance_rank

    FROM schedule s
    WHERE ${whereSQL}
    GROUP BY s.venue_slug, s.venue_name, s.venue_city
    ORDER BY games DESC
  `;

  const result = await knex.raw(sql, bindings);
  return result.rows;
}
