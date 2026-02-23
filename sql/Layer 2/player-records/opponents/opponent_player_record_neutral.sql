CREATE MATERIALIZED VIEW public.opponent_player_record_neutral AS

SELECT
    id,
    document_id,
    game_id,
    season,
    game_date,
    game_stage,
    game_round,

    -- league
    league_id,
    league_slug,

    -- player
    player_id,
    first_name,
    last_name,
    captain,
    position,
    secondary_position,
    shirt_number,
    age_decimal,

    -- team
    player_team_document_id,
    team_name,
    team_slug,
    team_short_name,
    is_home_team,

    -- opponent
    opponent_team_id,
    opponent_team_document_id,
    opponent_team_name,
    opponent_team_short_name,
    opponent_team_slug,

    -- stats
    status,
    minutes,
    seconds,
    -- minutes as decimal (minutes + seconds/60). NULL if minutes is NULL. NULLs sort last in ranking.
    CASE WHEN minutes IS NULL THEN NULL ELSE (minutes::numeric + COALESCE(seconds,0)::numeric / 60.0) END AS minutes_decimal,
    rank() OVER (ORDER BY (CASE WHEN minutes IS NULL THEN NULL ELSE (minutes::numeric + COALESCE(seconds,0)::numeric / 60.0) END) DESC NULLS LAST) AS minutes_rank,
    points,
    rank() OVER (ORDER BY (points) DESC NULLS LAST) AS points_rank,

    -- field goals
    field_goals_made,
    rank() OVER (ORDER BY (field_goals_made) DESC NULLS LAST) AS field_goals_made_rank,
    field_goals_attempted,
    rank() OVER (ORDER BY (field_goals_attempted) DESC NULLS LAST) AS field_goals_attempted_rank,
    field_goals_percentage,

    -- three pointers
    three_pointers_made,
    rank() OVER (ORDER BY (three_pointers_made) DESC NULLS LAST) AS three_pointers_made_rank,
    three_pointers_attempted,
    rank() OVER (ORDER BY (three_pointers_attempted) DESC NULLS LAST) AS three_pointers_attempted_rank,
    three_point_percentage,
    
    -- free throws
    free_throws_made,
    rank() OVER (ORDER BY (free_throws_made) DESC NULLS LAST) AS free_throws_made_rank,
    free_throws_attempted,
    rank() OVER (ORDER BY (free_throws_attempted) DESC NULLS LAST) AS free_throws_attempted_rank,
    free_throws_percentage,

    -- rebounds
    rebounds,
    rank() OVER (ORDER BY (rebounds) DESC NULLS LAST) AS rebounds_rank,
    offensive_rebounds,
    rank() OVER (ORDER BY (offensive_rebounds) DESC NULLS LAST) AS offensive_rebounds_rank,
    defensive_rebounds,
    rank() OVER (ORDER BY (defensive_rebounds) DESC NULLS LAST) AS defensive_rebounds_rank,

    -- passing
    assists,
    rank() OVER (ORDER BY (assists) DESC NULLS LAST) AS assists_rank,
    turnovers,
    rank() OVER (ORDER BY (turnovers) DESC NULLS LAST) AS turnovers_rank,

    -- defense
    steals,
    rank() OVER (ORDER BY (steals) DESC NULLS LAST) AS steals_rank,
    blocks,
    rank() OVER (ORDER BY (blocks) DESC NULLS LAST) AS blocks_rank,

    -- misc
    fouls,
    rank() OVER (ORDER BY (fouls) DESC NULLS LAST) AS fouls_rank,
    fouls_on,
    rank() OVER (ORDER BY (fouls_on) DESC NULLS LAST) AS fouls_on_rank,
    blocks_received,
    rank() OVER (ORDER BY (blocks_received) DESC NULLS LAST) AS blocks_received_rank,
    plus_minus,
    rank() OVER (ORDER BY (plus_minus) DESC NULLS LAST) AS plus_minus_rank,
    efficiency,
    rank() OVER (ORDER BY (efficiency) DESC NULLS LAST) AS efficiency_rank


FROM player_boxscore 
WHERE 
    is_nulled = FALSE AND 
    forfeited = FALSE AND
    status::text <> 'dnp-cd'::text AND
    is_home_team = 'neutral' AND 
    team_slug <> 'kk-zadar'