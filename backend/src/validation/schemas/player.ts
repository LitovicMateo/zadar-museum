/**
 * Validation schemas for Player API endpoints
 */
import { z } from "zod";
import {
  numericIdSchema,
  seasonSchema,
  databaseSchema,
  leagueSlugSchema,
} from "./common";
import { ALLOWED_PLAYER_RECORD_STATS } from "../whitelists";

/**
 * GET /api/player/boxscore
 * Query params: playerId, season (optional)
 */
export const playersBoxscoreQuerySchema = z.object({
  playerId: numericIdSchema,
  season: seasonSchema.optional(),
});

/**
 * GET /api/players/stats/:db/all-time
 * Query params: playerId
 */
export const playerAllTimeStatsQuerySchema = z.object({
  playerId: numericIdSchema,
});

/**
 * GET /api/player/:playerId/stats/:db
 * Params: playerId, db
 */
export const playerStatsParamsSchema = z.object({
  playerId: numericIdSchema,
  db: databaseSchema,
});

/**
 * GET /api/player/:playerId/number
 * Params: playerId
 */
export const playerNumberParamsSchema = z.object({
  playerId: numericIdSchema,
});

/**
 * GET /api/player/:playerId/seasons/:database
 * Params: playerId, database
 */
export const playerSeasonsParamsSchema = z.object({
  playerId: numericIdSchema,
  database: databaseSchema,
});

/**
 * GET /api/player/:playerId/season-competitions/:season
 * Params: playerId, season
 */
export const playerSeasonCompetitionsParamsSchema = z.object({
  playerId: numericIdSchema,
  season: seasonSchema,
});

/**
 * GET /api/player/:playerId
 * Params: playerId
 */
export const playerIdParamsSchema = z.object({
  playerId: numericIdSchema,
});

/**
 * GET /api/player/:playerId/career-high/:database
 * Params: playerId, database
 */
export const playerCareerHighParamsSchema = z.object({
  playerId: numericIdSchema,
  database: databaseSchema,
});

/**
 * GET /api/player/:playerId/season-average/:database/:season
 * Params: playerId, database, season
 */
export const playerSeasonAverageParamsSchema = z.object({
  playerId: numericIdSchema,
  database: databaseSchema,
  season: seasonSchema,
});

/**
 * GET /api/player/:playerId/season-totals/:database/:season
 * Params: playerId, database, season
 */
export const playerSeasonTotalsParamsSchema = z.object({
  playerId: numericIdSchema,
  database: databaseSchema,
  season: seasonSchema,
});

/**
 * GET /api/player/:playerId/league-totals/:database/:season
 * Params: playerId, database, season
 */
export const playerLeagueTotalsParamsSchema = z.object({
  playerId: numericIdSchema,
  database: databaseSchema,
  season: seasonSchema,
});

/**
 * GET /players/season-records/:database/:playerId/:season
 * Params: database, playerId, season
 */
export const playerSeasonRecordsParamsSchema = z.object({
  database: databaseSchema,
  playerId: numericIdSchema,
  season: seasonSchema,
});

/**
 * GET /players/split-records/:database/:playerId
 * Params: database, playerId
 * Query params: statKey (player stat, required), league (optional)
 */
export const playerSplitRecordsParamsSchema = z.object({
  database: databaseSchema,
  playerId: numericIdSchema,
});

export const playerSplitRecordsQuerySchema = z.object({
  statKey: z.enum(
    ALLOWED_PLAYER_RECORD_STATS as unknown as [string, ...string[]],
  ),
  league: leagueSlugSchema,
});
