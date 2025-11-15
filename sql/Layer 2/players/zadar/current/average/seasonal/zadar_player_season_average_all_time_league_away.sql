CREATE MATERIALIZED VIEW public.zadar_player_season_average_all_time_league_away AS
 
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
        END) AS games_started,`n    rank() OVER (PARTITION BY b.season ORDER BY (sum(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END)) DESC NULLS LAST) AS games_started_rank,

    round(avg(b.minutes + (b.seconds / 60.0)), 1) AS minutes,

    round(avg(b.points), 1) AS points,
    rank() OVER (ORDER BY (avg(b.points)) DESC NULLS LAST) AS points_rank,

    round(avg(b.assists), 1) AS assists,
    rank() OVER (ORDER BY (avg(b.assists)) DESC NULLS LAST) AS assists_rank,

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

    case 
        when avg(b.field_goals_made) = 0 then 0
        else round(avg(b.field_goals_made) / avg(b.field_goals_attempted) * 100, 1)
    end AS field_goal_percentage,

    round(avg(b.three_pointers_made), 1) AS three_pointers_made,
    rank() OVER (ORDER BY (avg(b.three_pointers_made)) DESC NULLS LAST) AS three_pointers_made_rank,

    round(avg(b.three_pointers_attempted), 1) AS three_pointers_attempted,
    rank() OVER (ORDER BY (avg(b.three_pointers_attempted)) DESC NULLS LAST) AS three_pointers_attempted_rank,

    case 
        when avg(b.three_pointers_attempted) = 0 then 0
        else round(avg(b.three_pointers_made) / avg(b.three_pointers_attempted) * 100, 1)
    end AS three_point_percentage,

    round(avg(b.free_throws_made), 1) AS free_throws_made,
    rank() OVER (ORDER BY (avg(b.free_throws_made)) DESC NULLS LAST) AS free_throws_made_rank,

    round(avg(b.free_throws_attempted), 1) AS free_throws_attempted,
    rank() OVER (ORDER BY (avg(b.free_throws_attempted)) DESC NULLS LAST) AS free_throws_attempted_rank,

    case 
        when avg(b.free_throws_attempted) = 0 then 0
        else round(avg(b.free_throws_made) / avg(b.free_throws_attempted) * 100, 1)
    end AS free_throw_percentage,

    round(avg(b.efficiency), 1) AS efficiency,
    rank() OVER (ORDER BY (avg(b.efficiency)) DESC NULLS LAST) AS efficiency_rank
    
   from player_boxscore b
  WHERE 
    b.team_slug::text = 'kk-zadar'::text AND 
    b.status::text <> 'dnp-cd'::text AND 
    b.is_home_team = 'away' AND
    b.is_nulled = false
  GROUP BY b.player_id, b.first_name, b.last_name, b.league_id, b.league_name, b.league_slug, b.season;