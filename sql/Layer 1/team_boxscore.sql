CREATE MATERIALIZED VIEW public.team_boxscore AS
 
 SELECT 
    ts.id,
    g.document_id AS game_id,

    -- game data
    g.season,
    g.stage,
    g.round,
    g.date AS game_date,
    g.is_nulled as is_nulled,
    g.forfeited as forfeited,
    g.forfeited_by AS forfeited_by,

    -- league
    c.document_id AS league_id,
    g.league_name AS league_name,
    g.league_short_name AS league_short_name,
    c.slug AS league_slug,

    -- team
    t.document_id AS team_id,
    CASE 
        WHEN t.id = ht.id THEN g.home_team_name
        ELSE g.away_team_name
    END AS team_name,
    CASE 
    WHEN t.id = ht.id THEN g.home_team_short_name
        ELSE g.away_team_short_name
    END AS team_short_name,
    t.slug AS team_slug,


    CASE 
        WHEN g.is_neutral = true THEN 'neutral'
        WHEN t.id = ht.id THEN 'home'
        ELSE 'away'
    END AS is_home_team,

    -- coaches
    hc.document_id AS head_coach_id,
    hc.first_name AS head_coach_first_name,
    hc.last_name AS head_coach_last_name,
    ac.document_id AS assistant_coach_id,
    ac.first_name AS assistant_coach_first_name,
    ac.last_name AS assistant_coach_last_name,


    -- score
    ts.first_quarter,
    ts.second_quarter,
    ts.third_quarter,
    ts.fourth_quarter,
    ts.overtime,
    COALESCE(ts.first_quarter, 0) 
    + COALESCE(ts.second_quarter, 0) 
    + COALESCE(ts.third_quarter, 0) 
    + COALESCE(ts.fourth_quarter, 0) 
    + COALESCE(ts.overtime, 0) AS score,

    -- stats
    ts.field_goals_made,
    ts.field_goals_attempted,
        CASE
            WHEN ts.field_goals_attempted = 0 THEN 0::numeric
            ELSE round(ts.field_goals_made::numeric / NULLIF(ts.field_goals_attempted, 0)::numeric * 100::numeric, 1)
        END AS field_goals_percentage,
    ts.three_pointers_made,
    ts.three_pointers_attempted,
        CASE
            WHEN ts.three_pointers_attempted = 0 THEN 0::numeric
            ELSE round(ts.three_pointers_made::numeric / NULLIF(ts.three_pointers_attempted, 0)::numeric * 100::numeric, 1)
        END AS three_pointers_percentage,
    ts.free_throws_made,
    ts.free_throws_attempted,
        CASE
            WHEN ts.free_throws_attempted = 0 THEN 0::numeric
            ELSE round(ts.free_throws_made::numeric / NULLIF(ts.free_throws_attempted, 0)::numeric * 100::numeric, 1)
        END AS free_throws_percentage,
    ts.offensive_rebounds,
    ts.defensive_rebounds,
    ts.rebounds,
    ts.assists,
    ts.turnovers,
    ts.blocks,
    ts.steals,
    ts.fouls


FROM team_stats ts
-- join game
LEFT JOIN team_stats_game_lnk tsglnk ON tsglnk.team_stat_id = ts.id
LEFT JOIN games g ON tsglnk.game_id = g.id

-- join home team
LEFT JOIN games_home_team_lnk ghtlnk ON ghtlnk.game_id = g.id
LEFT JOIN teams ht ON ht.id = ghtlnk.team_id

-- join away team
LEFT JOIN games_away_team_lnk gatlnk ON gatlnk.game_id = g.id
LEFT JOIN teams at ON at.id = gatlnk.team_id

-- join head/assistant coaches
LEFT JOIN team_stats_coach_lnk tsclnk ON tsclnk.team_stat_id = ts.id
LEFT JOIN coaches hc ON hc.id = tsclnk.coach_id
LEFT JOIN team_stats_assistant_coach_lnk tsaclnk ON tsaclnk.team_stat_id = ts.id
LEFT JOIN coaches ac ON ac.id = tsaclnk.coach_id

-- join team
LEFT JOIN team_stats_team_lnk tstlnk ON tstlnk.team_stat_id = ts.id
LEFT JOIN teams t ON t.id = tstlnk.team_id

-- join competition
LEFT JOIN games_competition_lnk gclnk ON gclnk.game_id = g.id
LEFT JOIN competitions c ON c.id = gclnk.competition_id
