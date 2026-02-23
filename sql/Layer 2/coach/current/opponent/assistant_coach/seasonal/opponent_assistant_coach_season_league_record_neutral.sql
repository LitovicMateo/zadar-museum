CREATE MATERIALIZED VIEW public.opponent_assistant_coach_season_league_record_neutral AS
SELECT
    cb.coach_id,
    cb.first_name,
    cb.last_name,

    cb.league_id,
    MAX(cb.league_name) AS league_name,
    MAX(cb.league_slug) AS league_slug,
    cb.season,

    COUNT(*) AS games,
    RANK() OVER (ORDER BY COUNT(*) DESC) AS games_rank,
    SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END) AS wins,
    RANK() OVER (ORDER BY SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END) DESC) AS wins_rank,
    SUM(CASE WHEN cb.team_score < cb.opponent_score THEN 1 ELSE 0 END) AS losses,
    RANK() OVER (ORDER BY SUM(CASE WHEN cb.team_score < cb.opponent_score THEN 1 ELSE 0 END) DESC) AS losses_rank,

    ROUND(
        SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END)::NUMERIC
        / NULLIF(COUNT(*), 0) * 100,
        1
    ) AS win_percentage,

    ROUND(AVG(cb.team_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_scored,
    RANK() OVER (ORDER BY AVG(cb.team_score) DESC) AS points_scored_rank,
    ROUND(AVG(cb.opponent_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_received,
    RANK() OVER (ORDER BY AVG(cb.opponent_score) DESC) AS points_received_rank,
    ROUND(AVG(cb.team_score - cb.opponent_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_difference,
    RANK() OVER (ORDER BY AVG(cb.team_score - cb.opponent_score) DESC) AS points_difference_rank

FROM
    public.coach_boxscore cb
WHERE
    cb.team_slug <> 'kk-zadar' AND
    cb.is_home_team = 'neutral' AND
    cb.coach_role = 'assistant' AND
    cb.is_nulled = FALSE
    
GROUP BY
    cb.coach_id,
    cb.first_name,
    cb.last_name,
    cb.league_id,
    cb.season
ORDER BY
    games DESC;
