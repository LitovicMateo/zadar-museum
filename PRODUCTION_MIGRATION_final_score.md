# Production migration: team-stat `final_score`

Adds a nullable `final_score` to team stats for games where only the final score is known, and changes `team_boxscore.score` to `COALESCE(final_score, sum of periods)`. Also makes unified `first_half` / `second_half` NULL (not 0) for quarter-format rows with no quarter data. Existing rows are unaffected: no backfill needed.

1. Back up: `make backup-prod-full`. Snapshot `SELECT game_id, team_id, score FROM team_boxscore` for a before/after diff.
2. Deploy the new backend image (Strapi adds the `final_score` column on boot). Confirm with `\d team_stats` in psql.
3. Recreate the matview: `DROP MATERIALIZED VIEW team_boxscore CASCADE;` then `make apply-mvs-prod`. Do NOT use `--force` (its cascade wrecks `schedule`). `schedule` and `coach_boxscore` depend on `team_boxscore` and are recreated by the same run.
4. Flush Redis `app:*` keys (aggregations are cached for 24h).
5. Verify: `score` is identical to the snapshot for every existing row; only `first_half` / `second_half` may change, and only from 0 to NULL for quarter rows with no quarter data.

Rollback: restore the step 1 backup (the matview recreate is the point of no return only for the SQL definition; data is untouched).
