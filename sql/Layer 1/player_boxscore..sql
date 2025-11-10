 CREATE MATERIALIZED VIEW public.player_boxscore AS
 
 SELECT 
    ps.id,
    ps.document_id,

    -- game
    g.document_id AS game_id,
    g.season,
    g.date AS game_date,
    g.stage AS game_stage,
    g.round AS game_round,
    g.is_nulled as is_nulled,
    g.forfeited as forfeited,
    g.forfeited_by AS forfeited_by,

    -- leeague
    c.document_id AS league_id,
    g.league_name AS league_name,
    g.league_short_name AS league_short_name,
    c.slug AS league_slug,

    -- player
    p.document_id AS player_id,
    p.first_name AS first_name,
    p.last_name AS last_name,
    ps.is_captain as captain,
    p.primary_position AS "position",
    p.secondary_position AS secondary_position,
    ps.player_number AS shirt_number,
    round(EXTRACT(epoch FROM g.date::timestamp without time zone - p.date_of_birth::timestamp without time zone) / (365.25 * 24::numeric * 60::numeric * 60::numeric), 1) AS age_decimal,

    -- team
    t.document_id AS player_team_document_id,
    t.name AS team_name,
    t.slug AS team_slug,
    t.short_name AS team_short_name,
    CASE
        WHEN g.is_neutral THEN 'neutral'
        WHEN tlnk.team_id = htlnk.team_id THEN 'home'
        ELSE 'away'
    END AS is_home_team,

    -- opponent
    CASE
        WHEN tlnk.team_id = htlnk.team_id THEN at.id
        ELSE ht.id
    END AS opponent_team_id,
    CASE
        WHEN tlnk.team_id = htlnk.team_id THEN at.document_id
        ELSE ht.document_id
    END AS opponent_team_document_id,
    CASE
        WHEN tlnk.team_id = htlnk.team_id THEN g.away_team_name
        ELSE g.home_team_name
    END AS opponent_team_name,
    CASE
        WHEN tlnk.team_id = htlnk.team_id THEN g.away_team_short_name
        ELSE g.home_team_short_name
    END AS opponent_team_short_name,
    CASE
        WHEN tlnk.team_id = htlnk.team_id THEN at.slug
        ELSE ht.slug
    END AS opponent_team_slug,

    -- stats
    ps.status,
    ps.minutes,
    ps.seconds,
    ps.points,

    -- field goals
    ps.field_goals_made,
    ps.field_goals_attempted,
        CASE
            WHEN ps.field_goals_attempted = 0 THEN 0::numeric
            ELSE round(ps.field_goals_made::numeric / NULLIF(ps.field_goals_attempted, 0)::numeric * 100::numeric, 1)
        END AS field_goals_percentage,

    -- three pointers
    ps.three_pointers_made,
    ps.three_pointers_attempted,
        CASE
            WHEN ps.three_pointers_attempted = 0 THEN 0::numeric
            ELSE round(ps.three_pointers_made::numeric / NULLIF(ps.three_pointers_attempted, 0)::numeric * 100::numeric, 1)
        END AS three_point_percentage,
    
    -- free throws
    ps.free_throws_made,
    ps.free_throws_attempted,
        CASE
            WHEN ps.free_throws_attempted = 0 THEN 0::numeric
            ELSE round(ps.free_throws_made::numeric / NULLIF(ps.free_throws_attempted, 0)::numeric * 100::numeric, 1)
        END AS free_throws_percentage,

    -- rebounds
    ps.rebounds,
    ps.offensive_rebounds,
    ps.defensive_rebounds,

    -- passing
    ps.assists,
    ps.turnovers,

    -- defense
    ps.steals,
    ps.blocks,

    -- misc
    ps.fouls,
    ps.fouls_on,
    ps.blocks_received,
    ps.plus_minus,
    ps.efficiency

   FROM player_stats ps

    -- game
    JOIN player_stats_game_lnk glnk ON ps.id = glnk.player_stat_id
    JOIN games g ON g.id = glnk.game_id
    
    -- player
    JOIN player_stats_player_lnk plnk ON ps.id = plnk.player_stat_id
    JOIN players p ON plnk.player_id = p.id

    -- player's team
    JOIN player_stats_team_lnk tlnk ON ps.id = tlnk.player_stat_id
    JOIN teams t ON tlnk.team_id = t.id

    -- home team
    JOIN games_home_team_lnk htlnk ON htlnk.game_id = g.id
    JOIN teams ht ON htlnk.team_id = ht.id
    
    -- away team
    JOIN games_away_team_lnk atlnk ON atlnk.game_id = g.id
    JOIN teams at ON atlnk.team_id = at.id

    -- league
    JOIN games_competition_lnk clnk ON clnk.game_id = g.id
    JOIN competitions c ON clnk.competition_id = c.id;