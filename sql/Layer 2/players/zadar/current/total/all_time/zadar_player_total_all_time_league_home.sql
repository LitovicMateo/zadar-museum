CREATE MATERIALIZED VIEW public.zadar_player_total_all_time_league_home AS

SELECT
    s.player_id,
    s.league_id,
    s.league_name,
    s.league_slug,
    s.first_name,
    s.last_name,

    s.games,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.games DESC NULLS LAST) AS games_rank,

    s.games_started,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.games_started DESC NULLS LAST) AS games_started_rank,

    s.minutes,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.minutes DESC NULLS LAST) AS minutes_rank,

    s.points,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.points DESC NULLS LAST) AS points_rank,

    s.assists,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.assists DESC NULLS LAST) AS assists_rank,

    s.off_rebounds,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.off_rebounds DESC NULLS LAST) AS off_rebounds_rank,

    s.def_rebounds,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.def_rebounds DESC NULLS LAST) AS def_rebounds_rank,

    s.rebounds,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.rebounds DESC NULLS LAST) AS rebounds_rank,

    s.steals,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.steals DESC NULLS LAST) AS steals_rank,

    s.blocks,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.blocks DESC NULLS LAST) AS blocks_rank,

    s.field_goals_made,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.field_goals_made DESC NULLS LAST) AS field_goals_made_rank,

    s.field_goals_attempted,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.field_goals_attempted DESC NULLS LAST) AS field_goals_attempted_rank,

    CASE WHEN s.field_goals_attempted = 0 THEN 0
             ELSE round(s.field_goals_made::numeric / s.field_goals_attempted * 100, 1)
    END AS field_goal_percentage,
    rank() OVER (PARTITION BY s.league_id ORDER BY (CASE WHEN s.field_goals_attempted = 0 THEN 0 ELSE round(s.field_goals_made::numeric / s.field_goals_attempted * 100, 1) END) DESC NULLS LAST) AS field_goal_percentage_rank,

    s.three_pointers_made,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.three_pointers_made DESC NULLS LAST) AS three_pointers_made_rank,

    s.three_pointers_attempted,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.three_pointers_attempted DESC NULLS LAST) AS three_pointers_attempted_rank,

    CASE WHEN s.three_pointers_attempted = 0 THEN 0
             ELSE round(s.three_pointers_made::numeric / s.three_pointers_attempted * 100, 1)
    END AS three_point_percentage,
    rank() OVER (PARTITION BY s.league_id ORDER BY (CASE WHEN s.three_pointers_attempted = 0 THEN 0 ELSE round(s.three_pointers_made::numeric / s.three_pointers_attempted * 100, 1) END) DESC NULLS LAST) AS three_point_percentage_rank,

    s.free_throws_made,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.free_throws_made DESC NULLS LAST) AS free_throws_made_rank,

    s.free_throws_attempted,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.free_throws_attempted DESC NULLS LAST) AS free_throws_attempted_rank,

    CASE WHEN s.free_throws_attempted = 0 THEN 0
             ELSE round(s.free_throws_made::numeric / s.free_throws_attempted * 100, 1)
    END AS free_throw_percentage,
    rank() OVER (PARTITION BY s.league_id ORDER BY (CASE WHEN s.free_throws_attempted = 0 THEN 0 ELSE round(s.free_throws_made::numeric / s.free_throws_attempted * 100, 1) END) DESC NULLS LAST) AS free_throw_percentage_rank,

    s.efficiency,
    rank() OVER (PARTITION BY s.league_id ORDER BY s.efficiency DESC NULLS LAST) AS efficiency_rank

FROM (
    SELECT b.player_id,
                 b.league_id,
                 MAX(b.league_name) AS league_name,
                 MAX(b.league_slug) AS league_slug,
                 b.first_name,
                 b.last_name,
                 count(b.game_id) AS games,
                 sum(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END) AS games_started,
                 sum(b.minutes + (b.seconds / 60.0)) AS minutes,
                 sum(b.points) AS points,
                 sum(b.assists) AS assists,
                 sum(b.offensive_rebounds) AS off_rebounds,
                 sum(b.defensive_rebounds) AS def_rebounds,
                 sum(b.rebounds) AS rebounds,
                 sum(b.steals) AS steals,
                 sum(b.blocks) AS blocks,
                 sum(b.field_goals_made) AS field_goals_made,
                 sum(b.field_goals_attempted) AS field_goals_attempted,
                 sum(b.three_pointers_made) AS three_pointers_made,
                 sum(b.three_pointers_attempted) AS three_pointers_attempted,
                 sum(b.free_throws_made) AS free_throws_made,
                 sum(b.free_throws_attempted) AS free_throws_attempted,
                 sum(b.efficiency) AS efficiency
        FROM player_boxscore b
     WHERE b.team_slug::text = 'kk-zadar'::text
         AND b.status::text <> 'dnp-cd'::text
         AND b.is_home_team = 'home'
         AND b.is_nulled = false
     GROUP BY b.player_id, b.first_name, b.last_name, b.league_id
) s;