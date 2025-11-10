CREATE MATERIALIZED VIEW public.referee_stats AS

WITH kk AS (
         SELECT teams.id AS kk_id
           FROM teams
          WHERE teams.name::text = 'KK Zadar'::text
         LIMIT 1
        ), game_scores AS (
         SELECT
            -- game details 
            g.id AS game_id,

            -- referees
            mr.id AS main_ref_id,
            sr.id AS second_ref_id,
            tr.id AS third_ref_id,

            -- teams
            ht.id AS home_team_id,
            at.id AS away_team_id,
            ht.name AS home_team_name,
            at.name AS away_team_name,

            -- score
            sum(
                CASE
                    WHEN tlnk.team_id = ht.id THEN COALESCE(ts.first_quarter, 0) + COALESCE(ts.second_quarter, 0) + COALESCE(ts.third_quarter, 0) + COALESCE(ts.fourth_quarter, 0) + COALESCE(ts.overtime, 0)
                    ELSE NULL::integer
                END) AS home_score,
            sum(
                CASE
                    WHEN tlnk.team_id = at.id THEN COALESCE(ts.first_quarter, 0) + COALESCE(ts.second_quarter, 0) + COALESCE(ts.third_quarter, 0) + COALESCE(ts.fourth_quarter, 0) + COALESCE(ts.overtime, 0)
                    ELSE NULL::integer
                END) AS away_score,

            -- fouls
            sum(
                CASE
                    WHEN tlnk.team_id = ht.id THEN COALESCE(ts.fouls, 0)
                    ELSE 0
                END) AS home_fouls,
            sum(
                CASE
                    WHEN tlnk.team_id = at.id THEN COALESCE(ts.fouls, 0)
                    ELSE 0
                END) AS away_fouls

           FROM games g
             JOIN games_home_team_lnk ghtlnk ON ghtlnk.game_id = g.id
             JOIN teams ht ON ht.id = ghtlnk.team_id
             JOIN games_away_team_lnk gatlnk ON gatlnk.game_id = g.id
             JOIN teams at ON at.id = gatlnk.team_id
             LEFT JOIN games_main_referee_lnk gmrlnk ON gmrlnk.game_id = g.id
             LEFT JOIN referees mr ON gmrlnk.referee_id = mr.id
             LEFT JOIN games_second_referee_lnk gsrlnk ON gsrlnk.game_id = g.id
             LEFT JOIN referees sr ON gsrlnk.referee_id = sr.id
             LEFT JOIN games_third_referee_lnk gtrlnk ON gtrlnk.game_id = g.id
             LEFT JOIN referees tr ON gtrlnk.referee_id = tr.id
             LEFT JOIN team_stats_game_lnk tsglnk ON tsglnk.game_id = g.id
             LEFT JOIN team_stats ts ON ts.id = tsglnk.team_stat_id
             LEFT JOIN team_stats_team_lnk tlnk ON tlnk.team_stat_id = ts.id

            WHERE 
                g.is_nulled = FALSE AND
                g.forfeited = FALSE 
          GROUP BY g.id, mr.id, sr.id, tr.id, ht.id, at.id, ht.name, at.name
        ), ref_game_union AS (

        -- main referee games
         SELECT game_scores.main_ref_id AS ref_id,
            game_scores.game_id
           FROM game_scores
          WHERE game_scores.main_ref_id IS NOT NULL AND game_scores.home_score IS NOT NULL AND game_scores.away_score IS NOT NULL
        UNION ALL

        -- second referee games
         SELECT game_scores.second_ref_id,
            game_scores.game_id
           FROM game_scores
          WHERE game_scores.second_ref_id IS NOT NULL AND game_scores.home_score IS NOT NULL AND game_scores.away_score IS NOT NULL
        UNION ALL

        -- third referee games
         SELECT game_scores.third_ref_id,
            game_scores.game_id
           FROM game_scores
          WHERE game_scores.third_ref_id IS NOT NULL AND game_scores.home_score IS NOT NULL AND game_scores.away_score IS NOT NULL
        )
 SELECT 
    -- referee details
    r.id AS referee_id,
    r.document_id AS referee_document_id,
    r.first_name,
    r.last_name,

    -- games
    count(DISTINCT
        CASE
            WHEN gs.home_team_id = kk.kk_id OR gs.away_team_id = kk.kk_id THEN u.game_id
            ELSE NULL::integer
        END) AS games,
    rank() OVER (
        ORDER BY count(DISTINCT
        CASE
            WHEN gs.home_team_id = kk.kk_id OR gs.away_team_id = kk.kk_id THEN u.game_id
            ELSE NULL::integer
        END) DESC
    ) AS games_rank,

    sum(
        CASE
            WHEN gs.home_team_id = kk.kk_id AND gs.home_score > gs.away_score OR gs.away_team_id = kk.kk_id AND gs.away_score > gs.home_score THEN 1
            ELSE 0
        END) AS wins,
    rank() OVER (
        ORDER BY sum(
        CASE
            WHEN gs.home_team_id = kk.kk_id AND gs.home_score > gs.away_score OR gs.away_team_id = kk.kk_id AND gs.away_score > gs.home_score THEN 1
            ELSE 0
        END) DESC
    ) AS wins_rank,

    sum(
        CASE
            WHEN gs.home_team_id = kk.kk_id AND gs.home_score < gs.away_score OR gs.away_team_id = kk.kk_id AND gs.away_score < gs.home_score THEN 1
            ELSE 0
        END) AS losses,
    rank() OVER (
        ORDER BY sum(
        CASE
            WHEN gs.home_team_id = kk.kk_id AND gs.home_score < gs.away_score OR gs.away_team_id = kk.kk_id AND gs.away_score < gs.home_score THEN 1
            ELSE 0
        END) DESC
    ) AS losses_rank,
    
    round(100.0 * sum(
        CASE
            WHEN gs.home_team_id = kk.kk_id AND gs.home_score > gs.away_score OR gs.away_team_id = kk.kk_id AND gs.away_score > gs.home_score THEN 1
            ELSE 0
        END)::numeric / NULLIF(count(DISTINCT
        CASE
            WHEN gs.home_team_id = kk.kk_id OR gs.away_team_id = kk.kk_id THEN u.game_id
            ELSE NULL::integer
        END), 0)::numeric, 1) AS win_percentage,

    round(avg(
        CASE
            WHEN gs.home_team_id = kk.kk_id THEN gs.home_fouls
            WHEN gs.away_team_id = kk.kk_id THEN gs.away_fouls
            ELSE NULL::bigint
        END), 1) AS fouls_for,
    rank() OVER (
        ORDER BY avg(
        CASE
            WHEN gs.home_team_id = kk.kk_id THEN gs.home_fouls
            WHEN gs.away_team_id = kk.kk_id THEN gs.away_fouls
            ELSE NULL::bigint
        END) DESC
    ) AS fouls_for_rank,

    round(avg(
        CASE
            WHEN gs.home_team_id = kk.kk_id THEN gs.away_fouls
            WHEN gs.away_team_id = kk.kk_id THEN gs.home_fouls
            ELSE NULL::bigint
        END), 1) AS fouls_against,
    rank() OVER (
        ORDER BY avg(
        CASE
            WHEN gs.home_team_id = kk.kk_id THEN gs.away_fouls
            WHEN gs.away_team_id = kk.kk_id THEN gs.home_fouls
            ELSE NULL::bigint
        END) DESC
    ) AS fouls_against_rank,
    
    round(avg(
        CASE
            WHEN gs.home_team_id = kk.kk_id THEN gs.home_fouls - gs.away_fouls
            WHEN gs.away_team_id = kk.kk_id THEN gs.away_fouls - gs.home_fouls
            ELSE NULL::bigint
        END), 1) AS foul_difference,
    rank() OVER (
        ORDER BY avg(
        CASE
            WHEN gs.home_team_id = kk.kk_id THEN gs.home_fouls - gs.away_fouls
            WHEN gs.away_team_id = kk.kk_id THEN gs.away_fouls - gs.home_fouls
            ELSE NULL::bigint
        END) DESC
    ) AS foul_difference_rank
   FROM ref_game_union u
     JOIN game_scores gs ON gs.game_id = u.game_id
     JOIN referees r ON r.id = u.ref_id
     CROSS JOIN kk
  GROUP BY r.id, r.document_id, r.first_name, r.last_name, kk.kk_id
  ORDER BY (count(DISTINCT
        CASE
            WHEN gs.home_team_id = kk.kk_id OR gs.away_team_id = kk.kk_id THEN u.game_id
            ELSE NULL::integer
        END)) DESC;