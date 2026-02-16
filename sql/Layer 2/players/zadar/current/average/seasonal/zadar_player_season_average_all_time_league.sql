CREATE MATERIALIZED VIEW public.zadar_player_season_average_all_time_league AS

 SELECT b.player_id,
     b.league_id,
     b.league_slug,
     b.first_name,
     b.last_name,
     b.is_active,
     b.season,
    count(b.game_id) AS games,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (count(b.game_id)) DESC NULLS LAST) AS games_rank,
    sum(
        CASE
            WHEN b.status::text = 'starter'::text THEN 1
            ELSE 0
        END) AS games_started,
    rank() OVER (PARTITION BY b.season ORDER BY (sum(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END)) DESC NULLS LAST) AS games_started_rank,

    round(avg(b.minutes + (b.seconds / 60.0)), 1) AS minutes,

    round(avg(b.points), 1) AS points,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (avg(b.points)) DESC NULLS LAST) AS points_rank,

    round(avg(b.assists), 1) AS assists,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (avg(b.assists)) DESC NULLS LAST) AS assists_rank,

    round(avg(b.offensive_rebounds), 1) AS off_rebounds,
    rank() OVER (ORDER BY (avg(b.offensive_rebounds)) DESC NULLS LAST) AS off_rebounds_rank,

    round(avg(b.defensive_rebounds), 1) AS def_rebounds,
    rank() OVER (ORDER BY (avg(b.defensive_rebounds)) DESC NULLS LAST) AS def_rebounds_rank,

    round(avg(b.rebounds), 1) AS rebounds,
    rank() OVER (ORDER BY (avg(b.rebounds)) DESC NULLS LAST) AS rebounds_rank,

    round(avg(b.steals), 1) AS steals,
    rank() OVER (ORDER BY (avg(b.steals)) DESC NULLS LAST) AS steals_rank,

    round(avg(b.blocks), 1) AS blocks,
    rank() OVER (ORDER BY (avg(b.blocks)) DESC NULLS LAST) AS blocks_rank,

    round(avg(b.field_goals_made), 1) AS field_goals_made,
    rank() OVER (ORDER BY (avg(b.field_goals_made)) DESC NULLS LAST) AS field_goals_made_rank,

    round(avg(b.field_goals_attempted), 1) AS field_goals_attempted,
    rank() OVER (ORDER BY (avg(b.field_goals_attempted)) DESC NULLS LAST) AS field_goals_attempted_rank,

    COALESCE(
        round(
            AVG(
                CASE
                    WHEN b.field_goals_attempted IS NULL OR b.field_goals_attempted = 0 THEN NULL
                    ELSE b.field_goals_made::numeric / b.field_goals_attempted
                END
            ) * 100,
            1
        ),
        0
    ) AS field_goal_percentage,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (COALESCE(
                round(
                    AVG(
                        CASE
                            WHEN b.field_goals_attempted IS NULL OR b.field_goals_attempted = 0 THEN NULL
                            ELSE b.field_goals_made::numeric / b.field_goals_attempted
                        END
                    ) * 100,
                    1
                ),
                0
            )) DESC NULLS LAST) AS field_goal_percentage_rank,

    round(avg(b.three_pointers_made), 1) AS three_pointers_made,
    rank() OVER (ORDER BY (avg(b.three_pointers_made)) DESC NULLS LAST) AS three_pointers_made_rank,

    round(avg(b.three_pointers_attempted), 1) AS three_pointers_attempted,
    rank() OVER (ORDER BY (avg(b.three_pointers_attempted)) DESC NULLS LAST) AS three_pointers_attempted_rank,

    COALESCE(
        round(
            AVG(
                CASE
                    WHEN b.three_pointers_attempted IS NULL OR b.three_pointers_attempted = 0 THEN NULL
                    ELSE b.three_pointers_made::numeric / b.three_pointers_attempted
                END
            ) * 100,
            1
        ),
        0
    ) AS three_point_percentage,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (COALESCE(
                round(
                    AVG(
                        CASE
                            WHEN b.three_pointers_attempted IS NULL OR b.three_pointers_attempted = 0 THEN NULL
                            ELSE b.three_pointers_made::numeric / b.three_pointers_attempted
                        END
                    ) * 100,
                    1
                ),
                0
            )) DESC NULLS LAST) AS three_point_percentage_rank,

    round(avg(b.free_throws_made), 1) AS free_throws_made,
    rank() OVER (ORDER BY (avg(b.free_throws_made)) DESC NULLS LAST) AS free_throws_made_rank,

    round(avg(b.free_throws_attempted), 1) AS free_throws_attempted,
    rank() OVER (ORDER BY (avg(b.free_throws_attempted)) DESC NULLS LAST) AS free_throws_attempted_rank,

    COALESCE(
        round(
            AVG(
                CASE
                    WHEN b.free_throws_attempted IS NULL OR b.free_throws_attempted = 0 THEN NULL
                    ELSE b.free_throws_made::numeric / b.free_throws_attempted
                END
            ) * 100,
            1
        ),
        0
    ) AS free_throw_percentage,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (COALESCE(
                round(
                    AVG(
                        CASE
                            WHEN b.free_throws_attempted IS NULL OR b.free_throws_attempted = 0 THEN NULL
                            ELSE b.free_throws_made::numeric / b.free_throws_attempted
                        END
                    ) * 100,
                    1
                ),
                0
            )) DESC NULLS LAST) AS free_throw_percentage_rank,

    round(avg(b.efficiency), 1) AS efficiency,
    rank() OVER (ORDER BY (avg(b.efficiency)) DESC NULLS LAST) AS efficiency_rank
    
   from player_boxscore b
  WHERE 
    b.team_slug::text = 'kk-zadar'::text AND 
    b.status::text <> 'dnp-cd'::text AND
    b.is_nulled = false
    GROUP BY b.player_id, b.first_name, b.last_name, b.is_active, b.league_id, b.league_slug, b.season;
