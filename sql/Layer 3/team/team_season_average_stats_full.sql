CREATE MATERIALIZED VIEW public.team_season_average_stats_full AS

SELECT
    total.team_id,
    total.team_slug,
    total.season,

    -- JSON: Total / Home / Away Totals
    jsonb_build_object(
            'key', 'Total',
            'games', total.games,
            'wins', total.wins,
            'losses', total.losses,
            'win_percentage', total.win_pct,
            'points_scored', total.points_scored,
            'points_received', total.points_received,
            'points_diff', total.points_diff,
            'attendance', total.attendance
        ) as total,

    jsonb_build_object(
            'key', 'Home',
            'games', home.games,
            'wins', home.wins,
            'losses', home.losses,
            'win_percentage', home.win_pct,
            'points_scored', home.points_scored,
            'points_received', home.points_received,
            'points_diff', home.points_diff,
            'attendance', home.attendance
        ) as home,

    jsonb_build_object(
            'key', 'Away',
            'games', away.games,
            'wins', away.wins,
            'losses', away.losses,
            'win_percentage', away.win_pct,
            'points_scored', away.points_scored,
            'points_received', away.points_received,
            'points_diff', away.points_diff,
            'attendance', away.attendance
        ) as away,

    jsonb_build_object(
            'key', 'Neutral',
            'games', neutral.games,
            'wins', neutral.wins,
            'losses', neutral.losses,
            'win_percentage', neutral.win_pct,
            'points_scored', neutral.points_scored,
            'points_received', neutral.points_received,
            'points_diff', neutral.points_diff,
            'attendance', neutral.attendance
        ) as neutral


FROM public.team_season_average_stats total
LEFT JOIN public.team_season_average_stats_home home USING (team_id, season)
LEFT JOIN public.team_season_average_stats_away away USING (team_id, season)
LEFT JOIN public.team_season_average_stats_neutral neutral USING (team_id, season);