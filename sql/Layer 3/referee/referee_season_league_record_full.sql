CREATE MATERIALIZED VIEW public.referee_season_league_record_full AS

SELECT
    total.referee_document_id as referee_id,
    total.first_name,
    total.last_name,
    total.season,
    total.league_id,
    total.league_slug,

    -- JSON: Total / Home / Away Totals
    jsonb_build_object(
            'key', 'Total',
            'league_id', total.league_id,
            'league_slug', total.league_slug,
            'games', total.games,
            'wins', total.wins,
            'losses', total.losses,
            'win_percentage', total.win_percentage,
            'fouls_for', total.fouls_for,
            'fouls_against', total.fouls_against,
            'foul_difference', total.foul_difference
        ) as total,

    jsonb_build_object(
        'key', 'Home',
        'league_id', home.league_id,
        'league_slug', home.league_slug,
        'games', home.games,
        'wins', home.wins,
        'losses', home.losses,
        'win_percentage', home.win_percentage,
        'fouls_for', home.fouls_for,
        'fouls_against', home.fouls_against,
        'foul_difference', home.foul_difference
    ) as home,

    jsonb_build_object(
        'key', 'Away',
        'league_id', away.league_id,
        'league_slug', away.league_slug,
        'games', away.games,
        'wins', away.wins,
        'losses', away.losses,
        'win_percentage', away.win_percentage,
        'fouls_for', away.fouls_for,
        'fouls_against', away.fouls_against,
        'foul_difference', away.foul_difference
    ) as away    




FROM (
  SELECT DISTINCT ON (referee_id, season, league_id) *
  FROM public.referee_season_league_stats
  ORDER BY referee_id, season, league_id
) total
LEFT JOIN (
  SELECT DISTINCT ON (referee_id, season, league_id) *
  FROM public.referee_season_league_stats_home
  ORDER BY referee_id, season, league_id
) home ON total.referee_id = home.referee_id
  AND total.season = home.season
  AND total.league_id = home.league_id
LEFT JOIN (
  SELECT DISTINCT ON (referee_id, season, league_id) *
  FROM public.referee_season_league_stats_away
  ORDER BY referee_id, season, league_id
) away ON total.referee_id = away.referee_id
  AND total.season = away.season
  AND total.league_id = away.league_id
