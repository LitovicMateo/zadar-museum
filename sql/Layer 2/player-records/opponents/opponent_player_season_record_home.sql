CREATE MATERIALIZED VIEW public.opponent_player_season_record_home AS

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
    points,
    rank() OVER (PARTITION BY season ORDER BY (points) DESC) AS points_rank,

    -- field goals
    field_goals_made,
    rank() OVER (PARTITION BY season ORDER BY (field_goals_made) DESC) AS field_goals_made_rank,
    field_goals_attempted,
    rank() OVER (PARTITION BY season ORDER BY (field_goals_attempted) DESC) AS field_goals_attempted_rank,
    field_goals_percentage,

    -- three pointers
    three_pointers_made,
    rank() OVER (PARTITION BY season ORDER BY (three_pointers_made) DESC) AS three_pointers_made_rank,
    three_pointers_attempted,
    rank() OVER (PARTITION BY season ORDER BY (three_pointers_attempted) DESC) AS three_pointers_attempted_rank,
    three_point_percentage,
    
    -- free throws
    free_throws_made,
    rank() OVER (PARTITION BY season ORDER BY (free_throws_made) DESC) AS free_throws_made_rank,
    free_throws_attempted,
    rank() OVER (PARTITION BY season ORDER BY (free_throws_attempted) DESC) AS free_throws_attempted_rank,
    free_throws_percentage,

    -- rebounds
    rebounds,
    rank() OVER (PARTITION BY season ORDER BY (rebounds) DESC) AS rebounds_rank,
    offensive_rebounds,
    rank() OVER (PARTITION BY season ORDER BY (offensive_rebounds) DESC) AS offensive_rebounds_rank,
    defensive_rebounds,
    rank() OVER (PARTITION BY season ORDER BY (defensive_rebounds) DESC) AS defensive_rebounds_rank,

    -- passing
    assists,
    rank() OVER (PARTITION BY season ORDER BY (assists) DESC) AS assists_rank,
    turnovers,
    rank() OVER (PARTITION BY season ORDER BY (turnovers) DESC) AS turnovers_rank,

    -- defense
    steals,
    rank() OVER (PARTITION BY season ORDER BY (steals) DESC) AS steals_rank,
    blocks,
    rank() OVER (PARTITION BY season ORDER BY (blocks) DESC) AS blocks_rank,

    -- misc
    fouls,
    rank() OVER (PARTITION BY season ORDER BY (fouls) DESC) AS fouls_rank,
    fouls_on,
    rank() OVER (PARTITION BY season ORDER BY (fouls_on) DESC) AS fouls_on_rank,
    blocks_received,
    rank() OVER (PARTITION BY season ORDER BY (blocks_received) DESC) AS blocks_received_rank,
    plus_minus,
    rank() OVER (PARTITION BY season ORDER BY (plus_minus) DESC) AS plus_minus_rank,
    efficiency,
    rank() OVER (PARTITION BY season ORDER BY (efficiency) DESC) AS efficiency_rank


FROM player_boxscore 
WHERE 
    is_nulled = false AND 
    forfeited = false AND 
    is_home_team = 'home' AND
    team_slug <> 'kk-zadar'