CREATE MATERIALIZED VIEW public.schedule AS 

SELECT 
    DISTINCT(g.id) AS game_id,
    g.document_id AS game_document_id,

    -- game
    g.date AS game_date,
    g.season,
    g.stage,
    g.round,
    g.attendance,
    g.forfeited,
    g.forfeited_by,
    g.is_nulled,

    -- referees
    mr.document_id AS main_referee_id,
    mr.first_name AS main_referee_first_name,
    mr.last_name AS main_referee_last_name,
    sr.document_id AS second_referee_id,
    sr.first_name AS second_referee_first_name,
    sr.last_name AS second_referee_last_name,
    tr.document_id AS third_referee_id,
    tr.first_name AS third_referee_first_name,
    tr.last_name AS third_referee_last_name,

    -- venue
    v.name AS venue_name,
    v.slug AS venue_slug,
    v.city AS venue_city,
    g.is_neutral,

    -- league
    c.document_id AS league_id,
    g.league_name,
    g.league_short_name,
    c.slug as league_slug,
    
    -- home team
    ht.id AS home_team_id,
    ht.document_id AS home_team_document_id,
    g.home_team_name AS home_team_name,
    g.home_team_short_name AS home_team_short_name,
    ht.slug AS home_team_slug,

    -- home team coaches
    tb_home.head_coach_id AS home_head_coach_id,
    tb_home.head_coach_first_name AS home_head_coach_first_name,
    tb_home.head_coach_last_name AS home_head_coach_last_name,
    tb_home.assistant_coach_id AS home_assistant_coach_id,
    tb_home.assistant_coach_first_name AS home_assistant_coach_first_name,
    tb_home.assistant_coach_last_name AS home_assistant_coach_last_name,

    CASE 
        WHEN g.forfeited = true AND g.forfeited_by = 'away' THEN 20
        WHEN g.forfeited = true AND g.forfeited_by = 'home' THEN 0
        ELSE tb_home.score
    END AS home_score,

    -- away team
    at.id AS away_team_id,
    at.document_id AS away_team_document_id,
    g.away_team_name AS away_team_name,
    g.away_team_short_name AS away_team_short_name,
    at.slug AS away_team_slug,

    -- away team coaches
    tb_away.head_coach_id AS away_head_coach_id,
    tb_away.head_coach_first_name AS away_head_coach_first_name,
    tb_away.head_coach_last_name AS away_head_coach_last_name,
    tb_away.assistant_coach_id AS away_assistant_coach_id,
    tb_away.assistant_coach_first_name AS away_assistant_coach_first_name,
    tb_away.assistant_coach_last_name AS away_assistant_coach_last_name,

    CASE 
      WHEN g.forfeited = true AND g.forfeited_by = 'home' THEN 20
      WHEN g.forfeited = true AND g.forfeited_by = 'away' THEN 0
      ELSE tb_away.score
    END AS away_score

FROM games g

-- league
JOIN games_competition_lnk gclnk ON g.id = gclnk.game_id
JOIN competitions c ON gclnk.competition_id = c.id

-- home team
JOIN games_home_team_lnk ghtlnk ON ghtlnk.game_id = g.id
JOIN teams ht ON ht.id = ghtlnk.team_id

-- away team
JOIN games_away_team_lnk gatlnk ON gatlnk.game_id = g.id
JOIN teams at ON at.id = gatlnk.team_id

-- venue
JOIN games_venue_lnk gvlnk ON g.id = gvlnk.game_id
JOIN venues v ON v.id = gvlnk.venue_id

-- Referees
LEFT JOIN games_main_referee_lnk gmrlnk ON gmrlnk.game_id = g.id
LEFT JOIN referees mr ON gmrlnk.referee_id = mr.id
LEFT JOIN games_second_referee_lnk gsrlnk ON gsrlnk.game_id = g.id
LEFT JOIN referees sr ON gsrlnk.referee_id = sr.id
LEFT JOIN games_third_referee_lnk gtrlnk ON gtrlnk.game_id = g.id
LEFT JOIN referees tr ON gtrlnk.referee_id = tr.id

-- Team stats
LEFT JOIN team_stats_game_lnk tsglnk ON tsglnk.game_id = g.id
LEFT JOIN team_stats ts ON ts.id = tsglnk.team_stat_id
LEFT JOIN team_stats_team_lnk tlnk ON tlnk.team_stat_id = ts.id

-- Head/assistant coaches per team
LEFT JOIN team_boxscore tb_home 
  ON tb_home.game_id = g.document_id 
  AND tb_home.team_id = ht.document_id

LEFT JOIN team_boxscore tb_away 
  ON tb_away.game_id = g.document_id 
  AND tb_away.team_id = at.document_id

