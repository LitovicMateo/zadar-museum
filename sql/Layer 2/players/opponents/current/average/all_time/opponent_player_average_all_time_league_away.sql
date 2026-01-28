CREATE MATERIALIZED VIEW public.opponent_player_average_all_time_league_away AS

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
           b.league_name,
           b.league_slug,
           b.first_name,
           b.last_name,
           count(DISTINCT b.game_id) AS games,
           sum(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END) AS games_started,
           round(avg(b.minutes + (b.seconds / 60.0)), 1) AS minutes,
           round(avg(b.points), 1) AS points,
           round(avg(b.assists), 1) AS assists,
           round(avg(b.offensive_rebounds), 1) AS off_rebounds,
           round(avg(b.defensive_rebounds), 1) AS def_rebounds,
           round(avg(b.rebounds), 1) AS rebounds,
           round(avg(b.steals), 1) AS steals,
           round(avg(b.blocks), 1) AS blocks,
           round(avg(b.field_goals_made), 1) AS field_goals_made,
           round(avg(b.field_goals_attempted), 1) AS field_goals_attempted,
           round(avg(b.three_pointers_made), 1) AS three_pointers_made,
           round(avg(b.three_pointers_attempted), 1) AS three_pointers_attempted,
           round(avg(b.free_throws_made), 1) AS free_throws_made,
           round(avg(b.free_throws_attempted), 1) AS free_throws_attempted,
           round(avg(b.efficiency), 1) AS efficiency
    FROM (
        SELECT DISTINCT ON (player_id, game_id, league_id) *
        FROM player_boxscore
        WHERE team_slug::text <> 'kk-zadar'::text
          AND status::text <> 'dnp-cd'::text
          AND is_home_team = 'away'
          AND is_nulled = false
        ORDER BY player_id, game_id, league_id, document_id
    ) b
    GROUP BY b.player_id, b.first_name, b.last_name, b.league_id, b.league_name, b.league_slug
) s;