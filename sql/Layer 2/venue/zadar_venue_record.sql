CREATE MATERIALIZED VIEW public.zadar_venue_record AS

SELECT
  -- venue
  s.venue_name,
  s.venue_slug,
  s.venue_city,

  -- games
  COUNT(*) AS games,
  SUM(
    CASE
      WHEN (s.home_team_slug = 'kk-zadar' AND s.home_score > s.away_score)
        OR (s.away_team_slug = 'kk-zadar' AND s.away_score > s.home_score)
      THEN 1 ELSE 0
    END
  ) AS wins,
  SUM(
    CASE
      WHEN (s.home_team_slug = 'kk-zadar' AND s.home_score < s.away_score)
        OR (s.away_team_slug = 'kk-zadar' AND s.away_score < s.home_score)
      THEN 1 ELSE 0
    END
  ) AS losses,
  ROUND(
    (SUM(
      CASE
        WHEN (s.home_team_slug = 'kk-zadar' AND s.home_score > s.away_score)
          OR (s.away_team_slug = 'kk-zadar' AND s.away_score > s.home_score)
        THEN 1 ELSE 0
      END
    )::decimal / COUNT(*)) * 100, 2
  ) AS win_percentage,

  -- attendance
  ROUND(AVG(NULLIF(s.attendance, '')::int), 0) AS avg_attendance

FROM
  public.schedule s

WHERE
  (s.home_team_slug = 'kk-zadar' OR s.away_team_slug = 'kk-zadar')
  AND s.home_score IS NOT NULL
  AND s.away_score IS NOT NULL
  AND s.is_nulled IS NOT TRUE
  
GROUP BY
  s.venue_slug,
  s.venue_name,
  s.venue_city
