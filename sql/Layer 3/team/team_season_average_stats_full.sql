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


FROM (
  SELECT DISTINCT ON (team_id, season) *
  FROM public.team_season_average_stats
  ORDER BY team_id, season
) total
LEFT JOIN (
  SELECT DISTINCT ON (team_id, season) *
  FROM public.team_season_average_stats_home
  ORDER BY team_id, season
) home ON total.team_id = home.team_id AND total.season = home.season
LEFT JOIN (
  SELECT DISTINCT ON (team_id, season) *
  FROM public.team_season_average_stats_away
  ORDER BY team_id, season
) away ON total.team_id = away.team_id AND total.season = away.season
LEFT JOIN (
  SELECT DISTINCT ON (team_id, season) *
  FROM public.team_season_average_stats_neutral
  ORDER BY team_id, season
) neutral ON total.team_id = neutral.team_id AND total.season = neutral.season;