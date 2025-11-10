CREATE MATERIALIZED VIEW public.zadar_coach_record_full AS

WITH coaches AS (
    SELECT DISTINCT coach_id, first_name, last_name FROM public.zadar_coach_record
    UNION
    SELECT DISTINCT coach_id, first_name, last_name FROM public.zadar_head_coach_record
    UNION
    SELECT DISTINCT coach_id, first_name, last_name FROM public.zadar_assistant_coach_record
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
        )
    ) AS assistant_coach_record

FROM coaches c
LEFT JOIN public.zadar_coach_record total USING (coach_id)
LEFT JOIN public.zadar_coach_record_home home USING (coach_id)
LEFT JOIN public.zadar_coach_record_away away USING (coach_id)
LEFT JOIN public.zadar_head_coach_record head USING (coach_id)
LEFT JOIN public.zadar_head_coach_record_home head_home USING (coach_id)
LEFT JOIN public.zadar_head_coach_record_away head_away USING (coach_id)
LEFT JOIN public.zadar_assistant_coach_record assistant USING (coach_id)
LEFT JOIN public.zadar_assistant_coach_record_home assistant_home USING (coach_id)
LEFT JOIN public.zadar_assistant_coach_record_away assistant_away USING (coach_id)
