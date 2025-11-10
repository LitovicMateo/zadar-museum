CREATE MATERIALIZED VIEW public.opponent_team_season_league_record_home AS

SELECT
    tb.id,
    tb.game_id,

    -- game data
    tb.season,
    tb.stage,
    tb.round,
    tb.game_date,
    tb.is_nulled,
    tb.forfeited,
    tb.forfeited_by,

    -- league
    tb.league_id,
    tb.league_name,
    tb.league_short_name,
    tb.league_slug,

    -- team
    tb.team_id,
    tb.team_name,
    tb.team_short_name,
    tb.team_slug,

    -- opponent
    otb.team_id AS opponent_team_id,
    otb.team_name AS opponent_team_name,
    otb.team_short_name AS opponent_team_short_name,
    otb.team_slug AS opponent_team_slug,
    
    tb.is_home_team,

    -- coaches
    tb.head_coach_id,
    tb.head_coach_first_name,
    tb.head_coach_last_name,
    tb.assistant_coach_id,
    tb.assistant_coach_first_name,
    tb.assistant_coach_last_name,


    -- score
    tb.first_quarter,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.first_quarter) DESC) AS first_quarter_rank,
    tb.second_quarter,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.second_quarter) DESC) AS second_quarter_rank,
    tb.third_quarter,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.third_quarter) DESC) AS third_quarter_rank,
    tb.fourth_quarter,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.fourth_quarter) DESC) AS fourth_quarter_rank,
    tb.overtime,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.overtime) DESC) AS overtime_rank,
    tb.score,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.score) DESC) AS score_rank,
    otb.score AS opponent_score,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (otb.score) ASC) AS opponent_score_rank,
    tb.score - otb.score AS score_diff,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.score - otb.score) DESC) AS score_diff_rank,

    -- stats
    tb.field_goals_made,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.field_goals_made) DESC) AS field_goals_made_rank,
    tb.field_goals_attempted,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.field_goals_attempted) DESC) AS field_goals_attempted_rank,
    tb.field_goals_percentage,
    tb.three_pointers_made,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.three_pointers_made) DESC) AS three_pointers_made_rank,
    tb.three_pointers_attempted,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.three_pointers_attempted) DESC) AS three_pointers_attempted_rank,
    tb.three_pointers_percentage,
    tb.free_throws_made,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.free_throws_made) DESC) AS free_throws_made_rank,
    tb.free_throws_attempted,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.free_throws_attempted) DESC) AS free_throws_attempted_rank,
    tb.free_throws_percentage,
    tb.offensive_rebounds,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.offensive_rebounds) DESC) AS offensive_rebounds_rank,
    tb.defensive_rebounds,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.defensive_rebounds) DESC) AS defensive_rebounds_rank,
    tb.rebounds,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.rebounds) DESC) AS rebounds_rank,
    tb.assists,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.assists) DESC) AS assists_rank,
    tb.turnovers,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.turnovers) DESC) AS turnovers_rank,
    tb.blocks,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.blocks) DESC) AS blocks_rank,
    tb.steals,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.steals) DESC) AS steals_rank,
    tb.fouls,
    rank() OVER (PARTITION BY tb.season, tb.league_id ORDER BY (tb.fouls) DESC) AS fouls_rank

FROM team_boxscore tb
LEFT JOIN team_boxscore otb ON tb.game_id = otb.game_id AND tb.team_id != otb.team_id
WHERE 
    tb.is_nulled = false AND 
    tb.forfeited = false AND 
    tb.is_home_team = 'home' AND
    tb.team_slug <> 'kk-zadar'