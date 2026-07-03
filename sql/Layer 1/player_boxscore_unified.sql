-- player_boxscore_unified
--
-- Combines regular per-game player rows (player_boxscore, one row per player per
-- game) with "aggregate lines" — game-less player_stat rows that hold a season/
-- tournament summary for historic data where only games-played and total points
-- (and occasionally a few other totals) are known.
--
-- Each row carries a `games` column so the aggregation layer can count games as
-- SUM(games) and compute per-game averages as SUM(stat) / SUM(games):
--   * per-game rows  -> games = 1
--   * aggregate rows -> games = games_played (the summarised game count)
--
-- Game-derived context (home/away, stage, date, game_id) is NULL for aggregate
-- rows; those NULLs inherit their column types from the player_boxscore branch of
-- the UNION. Aggregate rows are identified as player_stats with no linked game.

CREATE MATERIALIZED VIEW public.player_boxscore_unified AS

SELECT
    player_id,
    first_name,
    last_name,
    is_active_player,
    status,
    is_nulled,
    team_slug,
    is_home_team,
    league_id,
    league_name,
    league_short_name,
    league_slug,
    season,
    game_stage,
    game_date,
    game_id,
    minutes,
    seconds,
    points,
    assists,
    offensive_rebounds,
    defensive_rebounds,
    rebounds,
    steals,
    blocks,
    field_goals_made,
    field_goals_attempted,
    three_pointers_made,
    three_pointers_attempted,
    free_throws_made,
    free_throws_attempted,
    efficiency,
    1 AS games
FROM public.player_boxscore

UNION ALL

SELECT
    p.document_id AS player_id,
    p.first_name,
    p.last_name,
    p.is_active_player,
    ps.status,
    false AS is_nulled,
    t.slug AS team_slug,
    NULL AS is_home_team,
    c.document_id AS league_id,
    c.name AS league_name,
    c.short_name AS league_short_name,
    c.slug AS league_slug,
    ps.season,
    NULL AS game_stage,
    NULL AS game_date,
    NULL AS game_id,
    NULL AS minutes,
    NULL AS seconds,
    ps.points,
    ps.assists,
    ps.offensive_rebounds,
    ps.defensive_rebounds,
    ps.rebounds,
    ps.steals,
    ps.blocks,
    ps.field_goals_made,
    ps.field_goals_attempted,
    ps.three_pointers_made,
    ps.three_pointers_attempted,
    ps.free_throws_made,
    ps.free_throws_attempted,
    ps.efficiency,
    COALESCE(ps.games_played, 0) AS games
FROM player_stats ps

    -- game-less rows only (aggregate lines)
    LEFT JOIN player_stats_game_lnk glnk ON glnk.player_stat_id = ps.id

    -- player
    JOIN player_stats_player_lnk plnk ON plnk.player_stat_id = ps.id
    JOIN players p ON plnk.player_id = p.id

    -- player's team (required so the main / non-main team_slug filter can place them)
    JOIN player_stats_team_lnk tlnk ON tlnk.player_stat_id = ps.id
    JOIN teams t ON tlnk.team_id = t.id

    -- competition / league context (game-less rows carry it directly)
    JOIN player_stats_competition_lnk clnk ON clnk.player_stat_id = ps.id
    JOIN competitions c ON clnk.competition_id = c.id

WHERE glnk.game_id IS NULL;
