CREATE MATERIALIZED VIEW public.referee_all_time_record AS

SELECT
    total.referee_document_id as referee_id,
    total.first_name,
    total.last_name,

    -- JSON: Total / Home / Away Totals
    jsonb_build_object(
            'key', 'Total',
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
        'games', away.games,
        'wins', away.wins,
        'losses', away.losses,
        'win_percentage', away.win_percentage,
        'fouls_for', away.fouls_for,
        'fouls_against', away.fouls_against,
        'foul_difference', away.foul_difference
    ) as away    




FROM (
  SELECT DISTINCT ON (referee_id) *
  FROM public.referee_stats
  ORDER BY referee_id
) total
LEFT JOIN (
  SELECT DISTINCT ON (referee_id) *
  FROM public.referee_stats_home
  ORDER BY referee_id
) home ON total.referee_id = home.referee_id
LEFT JOIN (
  SELECT DISTINCT ON (referee_id) *
  FROM public.referee_stats_away
  ORDER BY referee_id
) away ON total.referee_id = away.referee_id
