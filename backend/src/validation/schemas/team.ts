/**
 * Validation schemas for Team API endpoints
 */
import { z } from "zod";
import {
  slugSchema,
  seasonSchema,
  databaseSchema,
  teamNameSchema,
  statKeySchema,
  teamIdSchema,
  entitySchema,
  leagueSlugSchema,
} from "./common";
import {
  ALLOWED_PLAYER_RECORD_STATS,
  ALLOWED_TEAM_RECORD_STATS,
} from "../whitelists";

/**
 * GET /api/team/:teamSlug
 * Params: teamSlug
 */
export const teamSlugParamsSchema = z.object({
  teamSlug: slugSchema,
});

/**
 * GET /api/team/:teamSlug/roster/:season
 * Params: teamSlug, season
 */
export const teamRosterParamsSchema = z.object({
  teamSlug: slugSchema,
  season: seasonSchema,
});

/**
 * GET /api/team/:teamSlug/seasons
 * Params: teamSlug
 */
export const teamSeasonsParamsSchema = z.object({
  teamSlug: slugSchema,
});

/**
 * GET /api/team/:teamSlug/season-competitions/:season
 * Params: teamSlug, season
 */
export const teamSeasonCompetitionsParamsSchema = z.object({
  teamSlug: slugSchema,
  season: seasonSchema,
});

/**
 * GET /api/team/season-competitions
 * Query params: teamName, season
 */
export const teamSeasonCompetitionsQuerySchema = z.object({
  teamName: teamNameSchema,
  season: seasonSchema,
});

/**
 * GET /api/team/:teamSlug/games/:season
 * Params: teamSlug, season
 */
export const teamGamesParamsSchema = z.object({
  teamSlug: slugSchema,
  season: seasonSchema,
});

/**
 * GET /api/team/:teamSlug/career-high/:season
 * Params: teamSlug, season
 */
export const teamCareerHighParamsSchema = z.object({
  teamSlug: slugSchema,
  season: seasonSchema,
});

/**
 * GET /api/team/leaders
 * Query params: team (slug), db (player|coach), statKey, competitionSlug?
 */
export const teamLeadersQuerySchema = z.object({
  team: slugSchema,
  db: entitySchema,
  statKey: statKeySchema,
  competitionSlug: slugSchema.optional().nullable(),
});

/**
 * GET /api/team/:teamSlug/average/:season
 * Params: teamSlug, season
 */
export const teamAverageParamsSchema = z.object({
  teamSlug: slugSchema,
  season: seasonSchema,
});

/**
 * GET /api/team/:teamSlug/record/:season
 * Params: teamSlug, season
 */
export const teamRecordParamsSchema = z.object({
  teamSlug: slugSchema,
  season: seasonSchema,
});

/**
 * GET /team/records/players/:teamSlug
 * Query params: statKey (player stat, required), season (optional)
 */
export const teamPlayerRecordsQuerySchema = z.object({
  statKey: z.enum(
    ALLOWED_PLAYER_RECORD_STATS as unknown as [string, ...string[]],
  ),
  season: seasonSchema,
});

/**
 * GET /team/records/teams/:teamSlug
 * Query params: statKey (team stat, required), season (optional)
 */
export const teamTeamRecordsQuerySchema = z.object({
  statKey: z.enum(
    ALLOWED_TEAM_RECORD_STATS as unknown as [string, ...string[]],
  ),
  season: seasonSchema,
});

/**
 * Team-vs-main scope for the League/Season tab player section.
 * 'team'  -> this team's own players
 * 'main'  -> the main team's players in games against this team (head-to-head)
 */
const teamScopeSchema = z.enum(["team", "main"]);

/**
 * GET /team/player-split-stats/:teamSlug
 * Query params: stats (total|average), database (team|main), league?, season?
 */
export const teamPlayerSplitStatsQuerySchema = z.object({
  stats: z.enum(["total", "average"]),
  database: teamScopeSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
});

/**
 * GET /team/player-split-records/:teamSlug
 * Query params: statKey, database (team|main), league?, season?
 */
export const teamPlayerSplitRecordsQuerySchema = z.object({
  statKey: z.enum(
    ALLOWED_PLAYER_RECORD_STATS as unknown as [string, ...string[]],
  ),
  database: teamScopeSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
});
