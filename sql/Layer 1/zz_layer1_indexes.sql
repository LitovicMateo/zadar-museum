-- Layer 1 Materialized View Indexes
-- Unique indexes enable REFRESH MATERIALIZED VIEW CONCURRENTLY.
-- B-tree indexes speed up WHERE/GROUP BY filters in Layer 2 aggregations.
-- This file has no CREATE MATERIALIZED VIEW statement, so apply-mvs.js
-- runs it unconditionally on every apply (idempotent via IF NOT EXISTS).

-- ============================================================
-- player_boxscore
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_player_boxscore_unique
    ON public.player_boxscore (player_id, game_id);

CREATE INDEX IF NOT EXISTS idx_player_boxscore_team_slug
    ON public.player_boxscore (team_slug);

CREATE INDEX IF NOT EXISTS idx_player_boxscore_league_id
    ON public.player_boxscore (league_id);

CREATE INDEX IF NOT EXISTS idx_player_boxscore_season
    ON public.player_boxscore (season);

CREATE INDEX IF NOT EXISTS idx_player_boxscore_game_date
    ON public.player_boxscore (game_date);

-- ============================================================
-- team_boxscore
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_team_boxscore_unique
    ON public.team_boxscore (team_id, game_id);

CREATE INDEX IF NOT EXISTS idx_team_boxscore_team_slug
    ON public.team_boxscore (team_slug);

CREATE INDEX IF NOT EXISTS idx_team_boxscore_league_id
    ON public.team_boxscore (league_id);

CREATE INDEX IF NOT EXISTS idx_team_boxscore_season
    ON public.team_boxscore (season);

CREATE INDEX IF NOT EXISTS idx_team_boxscore_game_date
    ON public.team_boxscore (game_date);

-- ============================================================
-- coach_boxscore
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_coach_boxscore_unique
    ON public.coach_boxscore (coach_id, game_id, coach_role);

CREATE INDEX IF NOT EXISTS idx_coach_boxscore_league_id
    ON public.coach_boxscore (league_id);

CREATE INDEX IF NOT EXISTS idx_coach_boxscore_season
    ON public.coach_boxscore (season);

-- ============================================================
-- schedule
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_schedule_unique
    ON public.schedule (game_id);

CREATE INDEX IF NOT EXISTS idx_schedule_season
    ON public.schedule (season);

CREATE INDEX IF NOT EXISTS idx_schedule_league_id
    ON public.schedule (league_id);

CREATE INDEX IF NOT EXISTS idx_schedule_venue_slug
    ON public.schedule (venue_slug);

CREATE INDEX IF NOT EXISTS idx_schedule_main_referee_id
    ON public.schedule (main_referee_id);

CREATE INDEX IF NOT EXISTS idx_schedule_second_referee_id
    ON public.schedule (second_referee_id);

CREATE INDEX IF NOT EXISTS idx_schedule_third_referee_id
    ON public.schedule (third_referee_id);

CREATE INDEX IF NOT EXISTS idx_schedule_home_team_slug ON public.schedule (home_team_slug);
CREATE INDEX IF NOT EXISTS idx_schedule_away_team_slug ON public.schedule (away_team_slug);
CREATE INDEX IF NOT EXISTS idx_schedule_game_date ON public.schedule (game_date);
