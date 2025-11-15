CREATE MATERIALIZED VIEW public.player_total_all_time_per_team_per_league_away AS

 SELECT b.player_id,
    b.first_name,
    b.last_name,
    b.team_slug,
    b.league_name,
    b.league_slug,
    count(b.game_id) AS games,
    rank() OVER (ORDER BY (count(b.game_id)) DESC NULLS LAST) AS games_rank,
    sum(
        CASE
            WHEN b.status::text = 'starter'::text THEN 1
            ELSE 0
        END) AS games_started,
    rank() OVER (ORDER BY (sum(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END)) DESC NULLS LAST) AS games_started_rank,

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

    sum(b.three_pointers_made) AS three_pointers_made,
    rank() OVER (ORDER BY (sum(b.three_pointers_made)) DESC NULLS LAST) AS three_pointers_made_rank,

    sum(b.three_pointers_attempted) AS three_pointers_attempted,
    rank() OVER (ORDER BY (sum(b.three_pointers_attempted)) DESC NULLS LAST) AS three_pointers_attempted_rank,

    case when sum(b.three_pointers_attempted) = 0 then 0
    else
        round(sum(b.three_pointers_made)::numeric /sum(b.three_pointers_attempted) * 100, 1) 
    end as three_point_percentage,

    sum(b.free_throws_made) AS free_throws_made,
    rank() OVER (ORDER BY (sum(b.free_throws_made)) DESC NULLS LAST) AS free_throws_made_rank,

    sum(b.free_throws_attempted) AS free_throws_attempted,
    rank() OVER (ORDER BY (sum(b.free_throws_attempted)) DESC NULLS LAST) AS free_throws_attempted_rank,

    case when sum(b.free_throws_attempted) = 0 then 0
    else
        round(sum(b.free_throws_made)::numeric /sum(b.free_throws_attempted) * 100, 1) 
    end as free_throw_percentage,

    sum(b.efficiency) AS efficiency,
    rank() OVER (ORDER BY (sum(b.efficiency)) DESC NULLS LAST) AS efficiency_rank

   from player_boxscore b
  WHERE 
    b.status::text <> 'dnp-cd'::text AND 
    b.is_home_team = 'away' AND
    b.is_nulled = false
  GROUP BY b.player_id, b.first_name, b.last_name, b.team_slug, b.league_name, b.league_slug;