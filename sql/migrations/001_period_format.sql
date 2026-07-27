-- One-shot migration: introduce explicit game period format and dedicated half columns.
--
-- Before this migration, games played in two halves stored their half scores in
-- first_quarter/second_quarter by convention, with third/fourth quarter written as 0
-- (not NULL, due to a `+'' === 0` coercion in the frontend create/update services).
-- This moves that data into the dedicated first_half/second_half columns and records
-- the format explicitly on the game.
--
-- Cutoff: FIBA switched from two 20-minute halves to four 10-minute quarters for the
-- 2000-01 season, so `season < '2000'` is the era rule.
--
-- Idempotent: safe to re-run.

BEGIN;

-- 1. Set the format on every game. Strapi does not backfill enumeration defaults on
--    existing rows, so both branches must be assigned explicitly.
UPDATE games SET period_format = 'halves'   WHERE season <  '2000' AND period_format IS DISTINCT FROM 'halves';
UPDATE games SET period_format = 'quarters' WHERE season >= '2000' AND period_format IS NULL;

-- 2. Move half-era period scores out of the quarter columns.
--    Guarded by `first_half IS NULL AND second_half IS NULL` so re-running does not
--    wipe already-migrated rows.
UPDATE team_stats ts SET
  first_half     = ts.first_quarter,
  second_half    = ts.second_quarter,
  first_quarter  = NULL,
  second_quarter = NULL,
  third_quarter  = NULL,
  fourth_quarter = NULL
FROM team_stats_game_lnk l
JOIN games g ON g.id = l.game_id
WHERE l.team_stat_id = ts.id
  AND g.period_format = 'halves'
  AND ts.first_half IS NULL
  AND ts.second_half IS NULL;

-- 3. Enforce the invariant going forward: the quarter and half column families are
--    mutually exclusive per row, and must match the parent game's declared format.
ALTER TABLE games
  ALTER COLUMN period_format SET DEFAULT 'quarters';

COMMIT;
