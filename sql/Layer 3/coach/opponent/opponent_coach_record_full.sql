CREATE MATERIALIZED VIEW public.opponent_coach_record_full AS

WITH coaches AS (
  SELECT
    coach_id,
    MIN(first_name) AS first_name,
    MIN(last_name) AS last_name
  FROM (
    SELECT coach_id, first_name, last_name FROM public.opponent_coach_record
    UNION ALL
    SELECT coach_id, first_name, last_name FROM public.opponent_head_coach_record
    UNION ALL
    SELECT coach_id, first_name, last_name FROM public.opponent_assistant_coach_record
  ) t
  GROUP BY coach_id
)
SELECT
    c.coach_id,
    c.first_name,
    c.last_name,

    -- 🟩 Total record
    jsonb_build_object(
        'total', jsonb_build_object(
            'games', total.games,
            'wins', total.wins,
            'losses', total.losses,
            'win_percentage', total.win_percentage,
            'points_scored', total.points_scored,
            'points_received', total.points_received,
            'points_difference', total.points_difference
        ),
        'home', jsonb_build_object(
            'games', home.games,
            'wins', home.wins,
            'losses', home.losses,
            'win_percentage', home.win_percentage,
            'points_scored', home.points_scored,
            'points_received', home.points_received,
            'points_difference', home.points_difference
        ),
        'away', jsonb_build_object(
            'games', away.games,
            'wins', away.wins,
            'losses', away.losses,
            'win_percentage', away.win_percentage,
            'points_scored', away.points_scored,
            'points_received', away.points_received,
            'points_difference', away.points_difference
        ),
        'neutral', jsonb_build_object(
            'games', neutral.games,
            'wins', neutral.wins,
            'losses', neutral.losses,
            'win_percentage', neutral.win_percentage,
            'points_scored', neutral.points_scored,
            'points_received', neutral.points_received,
            'points_difference', neutral.points_difference
        )
    ) AS total_record,

    -- 🟦 Head coach record
    jsonb_build_object(
        'total', jsonb_build_object(
            'games', head.games,
            'wins', head.wins,
            'losses', head.losses,
            'win_percentage', head.win_percentage,
            'points_scored', head.points_scored,
            'points_received', head.points_received,
            'points_difference', head.points_difference
        ),
        'home', jsonb_build_object(
            'games', head_home.games,
            'wins', head_home.wins,
            'losses', head_home.losses,
            'win_percentage', head_home.win_percentage,
            'points_scored', head_home.points_scored,
            'points_received', head_home.points_received,
            'points_difference', head_home.points_difference
        ),
        'away', jsonb_build_object(
            'games', head_away.games,
            'wins', head_away.wins,
            'losses', head_away.losses,
            'win_percentage', head_away.win_percentage,
            'points_scored', head_away.points_scored,
            'points_received', head_away.points_received,
            'points_difference', head_away.points_difference
        ),
        'neutral', jsonb_build_object(
            'games', head_neutral.games,
            'wins', head_neutral.wins,
            'losses', head_neutral.losses,
            'win_percentage', head_neutral.win_percentage,
            'points_scored', head_neutral.points_scored,
            'points_received', head_neutral.points_received,
            'points_difference', head_neutral.points_difference
        )
    ) AS head_coach_record,

    -- 🟧 Assistant coach record
    jsonb_build_object(
        'total', jsonb_build_object(
            'games', assistant.games,
            'wins', assistant.wins,
            'losses', assistant.losses,
            'win_percentage', assistant.win_percentage,
            'points_scored', assistant.points_scored,
            'points_received', assistant.points_received,
            'points_difference', assistant.points_difference
        ),
        'home', jsonb_build_object(
            'games', assistant_home.games,
            'wins', assistant_home.wins,
            'losses', assistant_home.losses,
            'win_percentage', assistant_home.win_percentage,
            'points_scored', assistant_home.points_scored,
            'points_received', assistant_home.points_received,
            'points_difference', assistant_home.points_difference
        ),
        'away', jsonb_build_object(
            'games', assistant_away.games,
            'wins', assistant_away.wins,
            'losses', assistant_away.losses,
            'win_percentage', assistant_away.win_percentage,
            'points_scored', assistant_away.points_scored,
            'points_received', assistant_away.points_received,
            'points_difference', assistant_away.points_difference
        ),
        'neutral', jsonb_build_object(
            'games', assistant_neutral.games,
            'wins', assistant_neutral.wins,
            'losses', assistant_neutral.losses,
            'win_percentage', assistant_neutral.win_percentage,
            'points_scored', assistant_neutral.points_scored,
            'points_received', assistant_neutral.points_received,
            'points_difference', assistant_neutral.points_difference
        )
    ) AS assistant_coach_record

FROM coaches c
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_coach_record
  ORDER BY coach_id
) total ON c.coach_id = total.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_coach_record_home
  ORDER BY coach_id
) home ON c.coach_id = home.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_coach_record_away
  ORDER BY coach_id
) away ON c.coach_id = away.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_coach_record_neutral
  ORDER BY coach_id
) neutral ON c.coach_id = neutral.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_head_coach_record
  ORDER BY coach_id
) head ON c.coach_id = head.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_head_coach_record_home
  ORDER BY coach_id
) head_home ON c.coach_id = head_home.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_head_coach_record_away
  ORDER BY coach_id
) head_away ON c.coach_id = head_away.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_head_coach_record_neutral
  ORDER BY coach_id
) head_neutral ON c.coach_id = head_neutral.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_assistant_coach_record
  ORDER BY coach_id
) assistant ON c.coach_id = assistant.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_assistant_coach_record_home
  ORDER BY coach_id
) assistant_home ON c.coach_id = assistant_home.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_assistant_coach_record_away
  ORDER BY coach_id
) assistant_away ON c.coach_id = assistant_away.coach_id
LEFT JOIN (
  SELECT DISTINCT ON (coach_id) *
  FROM public.opponent_assistant_coach_record_neutral
  ORDER BY coach_id
) assistant_neutral ON c.coach_id = assistant_neutral.coach_id
