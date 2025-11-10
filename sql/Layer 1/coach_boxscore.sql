CREATE MATERIALIZED VIEW public.coach_boxscore AS
WITH team_data AS (
    SELECT
        tb.game_id,
        tb.team_id,
        tb.team_name,
        tb.team_slug,
        tb.league_id,
        tb.league_name,
        tb.league_short_name,
        tb.league_slug,
        tb.season,
        tb.game_date,
        tb.is_nulled,
        tb.forfeited,
        tb.forfeited_by,
        tb.stage,
        tb.round,
        tb.is_home_team,
        tb.score AS team_score,

        -- Get opponent score via self join
        opp.team_name AS opponent_name,
        opp.team_short_name AS opponent_short_name,
        opp.team_slug AS opponent_slug,
        opp.score AS opponent_score,

        -- Coach info
        tb.head_coach_id,
        tb.head_coach_first_name,
        tb.head_coach_last_name,
        tb.assistant_coach_id,
        tb.assistant_coach_first_name,
        tb.assistant_coach_last_name
    FROM
        public.team_boxscore tb
        JOIN public.team_boxscore opp 
            ON opp.game_id = tb.game_id
           AND opp.team_id != tb.team_id
)
-- Head coach rows
SELECT
    head_coach_id AS coach_id,
    head_coach_first_name AS first_name,
    head_coach_last_name AS last_name,
    'head' AS coach_role,
    game_id,
    team_id,
    team_name,
    team_slug,
    league_id,
    league_name,
    league_short_name,
    league_slug,
    is_nulled,
    forfeited,
    forfeited_by,
    season,
    game_date,
    stage,
    round,
    is_home_team,
    team_score,
    opponent_name,
    opponent_short_name,
    opponent_slug,
    opponent_score
FROM team_data
WHERE head_coach_id IS NOT NULL

UNION ALL

-- Assistant coach rows
SELECT
    assistant_coach_id AS coach_id,
    assistant_coach_first_name AS first_name,
    assistant_coach_last_name AS last_name,
    'assistant' AS coach_role,
    game_id,
    team_id,
    team_name,
    team_slug,
    league_id,
    league_name,
    league_short_name,
    league_slug,
    is_nulled,
    forfeited,
    forfeited_by,
    season,
    game_date,
    stage,
    round,
    is_home_team,
    team_score,
    opponent_name,
    opponent_short_name,
    opponent_slug,
    opponent_score
FROM team_data
WHERE assistant_coach_id IS NOT NULL;
