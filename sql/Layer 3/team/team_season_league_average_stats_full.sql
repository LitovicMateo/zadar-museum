CREATE MATERIALIZED VIEW public.team_season_league_average_stats_full AS

SELECT
    total.team_id,
    total.team_slug,
    total.league_id,
    total.league_slug,
    total.season,

    -- JSON: Total / Home / Away Totals
    jsonb_build_object(
            'key', 'Total',
            'league_id', total.league_id,
            'league_slug', total.league_slug,
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
            'league_id', home.league_id,
            'league_slug', home.league_slug,
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
            'league_id', away.league_id,
            'league_slug', away.league_slug,
            'games', away.games,
            'wins', away.wins,
            'losses', away.losses,
            'win_percentage', away.win_pct,
            'points_scored', away.points_scored,
            'points_received', away.points_received,
            'points_diff', away.points_diff,
            'attendance', away.attendance
        ) as away


FROM public.team_season_league_average_stats total
LEFT JOIN public.team_season_league_average_stats_home home
  ON total.team_id = home.team_id
  AND total.league_id = home.league_id
  AND total.season = home.season
LEFT JOIN public.team_season_league_average_stats_away away
  ON total.team_id = away.team_id
  AND total.league_id = away.league_id
  AND total.season = away.season;
