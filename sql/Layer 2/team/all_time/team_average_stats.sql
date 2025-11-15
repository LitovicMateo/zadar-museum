CREATE MATERIALIZED VIEW public.team_average_stats AS

WITH all_games AS (
    SELECT 
        -- team
        s.home_team_id AS team_id,
        s.home_team_name AS team_name,
        s.home_team_slug AS team_slug,

        -- game
        s.game_id,
        s.game_date,
        s.forfeited,
        s.forfeited_by,
        s.is_nulled,
        s.attendance,

        -- venue
        CASE WHEN s.is_neutral THEN 'neutral' ELSE 'home' END AS venue,

        -- points
        s.home_score AS points_scored,
        s.away_score AS points_allowed,
        s.home_score - s.away_score AS points_diff
    FROM schedule s
    WHERE s.home_score IS NOT NULL 
      AND s.away_score IS NOT NULL 
      AND s.is_nulled IS NOT TRUE

    UNION ALL

    SELECT 
        s.away_team_id,
        s.away_team_name,
        s.away_team_slug,
        s.game_id,
        s.game_date,
        s.forfeited,
        s.forfeited_by,
        s.is_nulled,
        s.attendance,
        CASE WHEN s.is_neutral THEN 'neutral' ELSE 'away' END AS venue,
        s.away_score,
        s.home_score,
        s.away_score - s.home_score
    FROM schedule s
    WHERE s.home_score IS NOT NULL 
      AND s.away_score IS NOT NULL 
      AND s.is_nulled IS NOT TRUE
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
            )::numeric
            / NULLIF(COUNT(*) FILTER (WHERE is_nulled IS NOT TRUE), 0)::numeric,
            1
        ) AS win_pct,

        ROUND(AVG(points_scored)  FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_scored,
        ROUND(AVG(points_allowed) FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_received,
        ROUND(AVG(points_diff)    FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_diff,

        ROUND(AVG(NULLIF(attendance::text, ''::text)::numeric), 0) AS attendance

    FROM all_games
    GROUP BY team_id, team_slug
),

-- exclude kk-zadar for ranking calculation
agg_no_zadar AS (
    SELECT * FROM agg WHERE team_slug <> 'kk-zadar'
),

-- compute ranks on the filtered set
ranks AS (
    SELECT
        team_id,

        RANK() OVER (ORDER BY games DESC)          AS games_rank,
        RANK() OVER (ORDER BY wins DESC)           AS wins_rank,
        RANK() OVER (ORDER BY losses DESC)         AS losses_rank,
        RANK() OVER (ORDER BY points_scored DESC)  AS points_scored_rank,
        RANK() OVER (ORDER BY points_diff DESC)    AS points_diff_rank,
        RANK() OVER (ORDER BY points_received DESC)AS points_received_rank,
        RANK() OVER (ORDER BY attendance DESC)     AS attendance_rank

    FROM agg_no_zadar
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
    a.points_diff,
    r.points_diff_rank,
    a.points_received,
    r.points_received_rank,
    a.attendance,
    r.attendance_rank
FROM agg a
LEFT JOIN ranks r USING (team_id)
ORDER BY a.games DESC;
