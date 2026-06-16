-- Enforces the singleton constraint: at most one team can have is_main_team = true.
-- This is a belt-and-suspenders guarantee at the DB level, complementing the
-- lifecycle hook that clears the flag on all other teams before any update.
CREATE UNIQUE INDEX IF NOT EXISTS idx_teams_single_main_team
  ON teams ((is_main_team))
  WHERE is_main_team = true;
