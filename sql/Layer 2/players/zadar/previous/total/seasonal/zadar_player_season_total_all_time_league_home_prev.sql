 CREATE MATERIALIZED VIEW public.zadar_player_season_total_all_time_league_home_prev AS
 
 SELECT b.player_id,
    b.league_id,
    b.league_name,
    b.league_slug,
    b.first_name,
    b.last_name,
    b.season,

    count(b.game_id) AS games,
    rank() OVER (ORDER BY (count(b.game_id)) DESC NULLS LAST) AS games_rank,
    sum(
        CASE
            WHEN b.status::text = 'starter'::text THEN 1
            ELSE 0
        END) AS games_started,
    rank() OVER (PARTITION BY b.season ORDER BY (sum(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END)) DESC NULLS LAST) AS games_started_rank,

    sum(b.minutes + (b.seconds / 60.0)) AS minutes,
    rank() OVER (PARTITION BY b.season ORDER BY (sum(b.minutes + (b.seconds / 60.0))) DESC NULLS LAST) AS minutes_rank,

    sum(b.points) AS points,
    rank() OVER (ORDER BY (sum(b.points)) DESC NULLS LAST) AS points_rank,

    sum(b.assists) AS assists,
    rank() OVER (ORDER BY (sum(b.assists)) DESC NULLS LAST) AS assists_rank,

    sum(b.offensive_rebounds) AS off_rebounds,
    rank() OVER (ORDER BY (sum(b.offensive_rebounds)) DESC NULLS LAST) AS off_rebounds_rank,

    sum(b.defensive_rebounds) AS def_rebounds,
    rank() OVER (ORDER BY (sum(b.defensive_rebounds)) DESC NULLS LAST) AS def_rebounds_rank,

    sum(b.rebounds) AS rebounds,
    rank() OVER (ORDER BY (sum(b.rebounds)) DESC NULLS LAST) AS rebounds_rank,

    sum(b.steals) AS steals,
    rank() OVER (ORDER BY (sum(b.steals)) DESC NULLS LAST) AS steals_rank,

    sum(b.blocks) AS blocks,
    rank() OVER (ORDER BY (sum(b.blocks)) DESC NULLS LAST) AS blocks_rank,

    sum(b.field_goals_made) AS field_goals_made,
    rank() OVER (ORDER BY (sum(b.field_goals_made)) DESC NULLS LAST) AS field_goals_made_rank,

    sum(b.field_goals_attempted) AS field_goals_attempted,
    rank() OVER (ORDER BY (sum(b.field_goals_attempted)) DESC NULLS LAST) AS field_goals_attempted_rank,

    case when sum(b.field_goals_attempted) = 0 then 0
    else
        round(sum(b.field_goals_made)::numeric /sum(b.field_goals_attempted) * 100, 1) 
    end as field_goal_percentage,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (case when sum(b.field_goals_attempted) = 0 then 0 else round(sum(b.field_goals_made)::numeric /sum(b.field_goals_attempted) * 100, 1) end) DESC NULLS LAST) AS field_goal_percentage_rank,

    sum(b.three_pointers_made) AS three_pointers_made,
    rank() OVER (ORDER BY (sum(b.three_pointers_made)) DESC NULLS LAST) AS three_pointers_made_rank,

    sum(b.three_pointers_attempted) AS three_pointers_attempted,
    rank() OVER (ORDER BY (sum(b.three_pointers_attempted)) DESC NULLS LAST) AS three_pointers_attempted_rank,

    case when sum(b.three_pointers_attempted) = 0 then 0
    else
        round(sum(b.three_pointers_made)::numeric /sum(b.three_pointers_attempted) * 100, 1) 
    end as three_point_percentage,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (case when sum(b.three_pointers_attempted) = 0 then 0 else round(sum(b.three_pointers_made)::numeric /sum(b.three_pointers_attempted) * 100, 1) end) DESC NULLS LAST) AS three_point_percentage_rank,

    sum(b.free_throws_made) AS free_throws_made,
    rank() OVER (ORDER BY (sum(b.free_throws_made)) DESC NULLS LAST) AS free_throws_made_rank,

    sum(b.free_throws_attempted) AS free_throws_attempted,
    rank() OVER (ORDER BY (sum(b.free_throws_attempted)) DESC NULLS LAST) AS free_throws_attempted_rank,

    case when sum(b.free_throws_attempted) = 0 then 0
    else
        round(sum(b.free_throws_made)::numeric /sum(b.free_throws_attempted) * 100, 1) 
    end as free_throw_percentage,
    rank() OVER (PARTITION BY b.league_id, b.season ORDER BY (case when sum(b.free_throws_attempted) = 0 then 0 else round(sum(b.free_throws_made)::numeric /sum(b.free_throws_attempted) * 100, 1) end) DESC NULLS LAST) AS free_throw_percentage_rank,

    sum(b.efficiency) AS efficiency,
    rank() OVER (ORDER BY (sum(b.efficiency)) DESC NULLS LAST) AS efficiency_rank

   from player_boxscore b
  WHERE 
    b.team_slug::text = 'kk-zadar'::text AND 
    b.status::text <> 'dnp-cd'::text AND 
    b.is_home_team = 'home' AND
    b.is_nulled = false AND
    b.game_date < (
        SELECT MAX (game_date) 
        FROM player_boxscore
        WHERE 
            team_slug::text = 'kk-zadar'::text AND 
            status::text <> 'dnp-cd'::text AND
            is_home_team = 'home'
    )
  GROUP BY b.player_id, b.first_name, b.last_name, b.league_id, b.league_name, b.league_slug, b.season;