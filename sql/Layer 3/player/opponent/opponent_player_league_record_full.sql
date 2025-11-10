CREATE MATERIALIZED VIEW public.opponent_player_league_record_full AS
SELECT
    total.player_id,
    total.first_name,
    total.last_name,

    -- JSON: Total / Home / Away Totals
    jsonb_build_object(
        'total', jsonb_build_object(
            'key', 'total',

            'league_id', total.league_id,
            'league_slug', total.league_slug,

            'games', total.games,
            'games_rank', total.games_rank,
            'games_started', total.games_started,
            'minutes', total.minutes,

            'points', total.points,
            'points_rank', total.points_rank,

            'assists', total.assists,
            'assists_rank', total.assists_rank,

            'off_rebounds', total.off_rebounds,
            'off_rebounds_rank', total.off_rebounds_rank,

            'def_rebounds', total.def_rebounds,
            'def_rebounds_rank', total.def_rebounds_rank,

            'rebounds', total.rebounds,
            'rebounds_rank', total.rebounds_rank,

            'steals', total.steals,
            'steals_rank', total.steals_rank,

            'blocks', total.blocks,
            'blocks_rank', total.blocks_rank,

            'field_goals_made', total.field_goals_made,
            'field_goals_made_rank', total.field_goals_made_rank,

            'field_goals_attempted', total.field_goals_attempted,
            'field_goals_attempted_rank', total.field_goals_attempted_rank,

            'field_goal_percentage', total.field_goal_percentage,

            'three_pointers_made', total.three_pointers_made,
            'three_pointers_made_rank', total.three_pointers_made_rank,

            'three_pointers_attempted', total.three_pointers_attempted,
            'three_pointers_attempted_rank', total.three_pointers_attempted_rank,

            'three_point_percentage', total.three_point_percentage,

            'free_throws_made', total.free_throws_made,
            'free_throws_made_rank', total.free_throws_made_rank,

            'free_throws_attempted', total.free_throws_attempted,
            'free_throws_attempted_rank', total.free_throws_attempted_rank,

            'free_throw_percentage', total.free_throw_percentage,
            'efficiency', total.efficiency,
            'efficiency_rank', total.efficiency_rank
        ),
        'home', jsonb_build_object(
            'key', 'home',

            'league_id', home.league_id,
            'league_slug', home.league_slug,

            'games', home.games,
            'games_rank', home.games_rank,
            'games_started', home.games_started,
            'minutes', home.minutes,

            'points', home.points,
            'points_rank', home.points_rank,

            'assists', home.assists,
            'assists_rank', home.assists_rank,

            'off_rebounds', home.off_rebounds,
            'off_rebounds_rank', home.off_rebounds_rank,

            'def_rebounds', home.def_rebounds,
            'def_rebounds_rank', home.def_rebounds_rank,

            'rebounds', home.rebounds,
            'rebounds_rank', home.rebounds_rank,

            'steals', home.steals,
            'steals_rank', home.steals_rank,
            
            'blocks', home.blocks,
            'blocks_rank', home.blocks_rank,

            'field_goals_made', home.field_goals_made,
            'field_goals_made_rank', home.field_goals_made_rank,

            'field_goals_attempted', home.field_goals_attempted,
            'field_goals_attempted_rank', home.field_goals_attempted_rank,

            'field_goal_percentage', home.field_goal_percentage,

            'three_pointers_made', home.three_pointers_made,
            'three_pointers_made_rank', home.three_pointers_made_rank,

            'three_pointers_attempted', home.three_pointers_attempted,
            'three_pointers_attempted_rank', home.three_pointers_attempted_rank,

            'three_point_percentage', home.three_point_percentage,

            'free_throws_made', home.free_throws_made,
            'free_throws_made_rank', home.free_throws_made_rank,

            'free_throws_attempted', home.free_throws_attempted,
            'free_throws_attempted_rank', home.free_throws_attempted_rank,

            'free_throw_percentage', home.free_throw_percentage,
            'efficiency', home.efficiency,
            'efficiency_rank', home.efficiency_rank
        ),
        'away', jsonb_build_object(
            'key', 'away',

            'league_id', away.league_id,
            'league_slug', away.league_slug,

            'games', away.games,
            'games_rank', away.games_rank,
            'games_started', away.games_started,
            'minutes', away.minutes,

            'points', away.points,
            'points_rank', away.points_rank,

            'assists', away.assists,
            'assists_rank', away.assists_rank,

            'off_rebounds', away.off_rebounds,
            'off_rebounds_rank', away.off_rebounds_rank,

            'def_rebounds', away.def_rebounds,
            'def_rebounds_rank', away.def_rebounds_rank,

            'rebounds', away.rebounds,
            'rebounds_rank', away.rebounds_rank,

            'steals', away.steals,
            'steals_rank', away.steals_rank,
            
            'blocks', away.blocks,
            'blocks_rank', away.blocks_rank,

            'field_goals_made', away.field_goals_made,
            'field_goals_made_rank', away.field_goals_made_rank,

            'field_goals_attempted', away.field_goals_attempted,
            'field_goals_attempted_rank', away.field_goals_attempted_rank,

            'field_goal_percentage', away.field_goal_percentage,

            'three_pointers_made', away.three_pointers_made,
            'three_pointers_made_rank', away.three_pointers_made_rank,

            'three_pointers_attempted', away.three_pointers_attempted,
            'three_pointers_attempted_rank', away.three_pointers_attempted_rank,

            'three_point_percentage', away.three_point_percentage,

            'free_throws_made', away.free_throws_made,
            'free_throws_made_rank', away.free_throws_made_rank,

            'free_throws_attempted', away.free_throws_attempted,
            'free_throws_attempted_rank', away.free_throws_attempted_rank,

            'free_throw_percentage', away.free_throw_percentage,
            'efficiency', away.efficiency,
            'efficiency_rank', away.efficiency_rank
        )
    ) AS total,

    -- JSON: Total / Home / Away Averages
    jsonb_build_object(
        'total', jsonb_build_object(
            'key', 'total',

            'league_id', avg_total.league_id,
            'league_slug', avg_total.league_slug,

            'games', avg_total.games,
            'games_rank', avg_total.games_rank,
            'games_started', avg_total.games_started,
            'minutes', avg_total.minutes,

            'points', avg_total.points,
            'points_rank', avg_total.points_rank,

            'assists', avg_total.assists,
            'assists_rank', avg_total.assists_rank,

            'off_rebounds', avg_total.off_rebounds,
            'off_rebounds_rank', avg_total.off_rebounds_rank,

            'def_rebounds', avg_total.def_rebounds,
            'def_rebounds_rank', avg_total.def_rebounds_rank,

            'rebounds', avg_total.rebounds,
            'rebounds_rank', avg_total.rebounds_rank,

            'steals', avg_total.steals,
            'steals_rank', avg_total.steals_rank,
            
            'blocks', avg_total.blocks,
            'blocks_rank', avg_total.blocks_rank,

            'field_goals_made', avg_total.field_goals_made,
            'field_goals_made_rank', avg_total.field_goals_made_rank,

            'field_goals_attempted', avg_total.field_goals_attempted,
            'field_goals_attempted_rank', avg_total.field_goals_attempted_rank,

            'field_goal_percentage', avg_total.field_goal_percentage,

            'three_pointers_made', avg_total.three_pointers_made,
            'three_pointers_made_rank', avg_total.three_pointers_made_rank,

            'three_pointers_attempted', avg_total.three_pointers_attempted,
            'three_pointers_attempted_rank', avg_total.three_pointers_attempted_rank,

            'three_point_percentage', avg_total.three_point_percentage,

            'free_throws_made', avg_total.free_throws_made,
            'free_throws_made_rank', avg_total.free_throws_made_rank,

            'free_throws_attempted', avg_total.free_throws_attempted,
            'free_throws_attempted_rank', avg_total.free_throws_attempted_rank,

            'free_throw_percentage', avg_total.free_throw_percentage,
            'efficiency', avg_total.efficiency,
            'efficiency_rank', avg_total.efficiency_rank
        ),
        'home', jsonb_build_object(
            'key', 'home',

            'league_id', avg_home.league_id,
            'league_slug', avg_home.league_slug,

            'games', avg_home.games,
            'games_rank', avg_home.games_rank,
            'games_started', avg_home.games_started,
            'minutes', avg_home.minutes,

            'points', avg_home.points,
            'points_rank', avg_home.points_rank,

            'assists', avg_home.assists,
            'assists_rank', avg_home.assists_rank,

            'off_rebounds', avg_home.off_rebounds,
            'off_rebounds_rank', avg_home.off_rebounds_rank,

            'def_rebounds', avg_home.def_rebounds,
            'def_rebounds_rank', avg_home.def_rebounds_rank,

            'rebounds', avg_home.rebounds,
            'rebounds_rank', avg_home.rebounds_rank,

            'steals', avg_home.steals,
            'steals_rank', avg_home.steals_rank,
            
            'blocks', avg_home.blocks,
            'blocks_rank', avg_home.blocks_rank,

            'field_goals_made', avg_home.field_goals_made,
            'field_goals_made_rank', avg_home.field_goals_made_rank,

            'field_goals_attempted', avg_home.field_goals_attempted,
            'field_goals_attempted_rank', avg_home.field_goals_attempted_rank,

            'field_goal_percentage', avg_home.field_goal_percentage,

            'three_pointers_made', avg_home.three_pointers_made,
            'three_pointers_made_rank', avg_home.three_pointers_made_rank,

            'three_pointers_attempted', avg_home.three_pointers_attempted,
            'three_pointers_attempted_rank', avg_home.three_pointers_attempted_rank,

            'three_point_percentage', avg_home.three_point_percentage,

            'free_throws_made', avg_home.free_throws_made,
            'free_throws_made_rank', avg_home.free_throws_made_rank,

            'free_throws_attempted', avg_home.free_throws_attempted,
            'free_throws_attempted_rank', avg_home.free_throws_attempted_rank,

            'free_throw_percentage', avg_home.free_throw_percentage,
            'efficiency', avg_home.efficiency,
            'efficiency_rank', avg_home.efficiency_rank
        ),
        'away', jsonb_build_object(
            'key', 'away',

            'league_id', avg_away.league_id,
            'league_slug', avg_away.league_slug,

            'games', avg_away.games,
            'games_rank', avg_away.games_rank,
            'games_started', avg_away.games_started,
            'minutes', avg_away.minutes,

            'points', avg_away.points,
            'points_rank', avg_away.points_rank,

            'assists', avg_away.assists,
            'assists_rank', avg_away.assists_rank,

            'off_rebounds', avg_away.off_rebounds,
            'off_rebounds_rank', avg_away.off_rebounds_rank,

            'def_rebounds', avg_away.def_rebounds,
            'def_rebounds_rank', avg_away.def_rebounds_rank,

            'rebounds', avg_away.rebounds,
            'rebounds_rank', avg_away.rebounds_rank,

            'steals', avg_away.steals,
            'steals_rank', avg_away.steals_rank,
            
            'blocks', avg_away.blocks,
            'blocks_rank', avg_away.blocks_rank,

            'field_goals_made', avg_away.field_goals_made,
            'field_goals_made_rank', avg_away.field_goals_made_rank,

            'field_goals_attempted', avg_away.field_goals_attempted,
            'field_goals_attempted_rank', avg_away.field_goals_attempted_rank,

            'field_goal_percentage', avg_away.field_goal_percentage,

            'three_pointers_made', avg_away.three_pointers_made,
            'three_pointers_made_rank', avg_away.three_pointers_made_rank,

            'three_pointers_attempted', avg_away.three_pointers_attempted,
            'three_pointers_attempted_rank', avg_away.three_pointers_attempted_rank,

            'three_point_percentage', avg_away.three_point_percentage,

            'free_throws_made', avg_away.free_throws_made,
            'free_throws_made_rank', avg_away.free_throws_made_rank,

            'free_throws_attempted', avg_away.free_throws_attempted,
            'free_throws_attempted_rank', avg_away.free_throws_attempted_rank,

            'free_throw_percentage', avg_away.free_throw_percentage,
            'efficiency', avg_away.efficiency,
            'efficiency_rank', avg_away.efficiency_rank
        )
    ) AS average

FROM public.opponent_player_total_all_time_league total
LEFT JOIN public.opponent_player_total_all_time_league_home home USING (player_id, first_name, last_name)
LEFT JOIN public.opponent_player_total_all_time_league_away away USING (player_id, first_name, last_name)
LEFT JOIN public.opponent_player_average_all_time_league avg_total USING (player_id, first_name, last_name)
LEFT JOIN public.opponent_player_average_all_time_league_home avg_home USING (player_id, first_name, last_name)
LEFT JOIN public.opponent_player_average_all_time_league_away avg_away USING (player_id, first_name, last_name);
