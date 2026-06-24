/**
 * Validation schemas for Stats API endpoints
 */
import { z } from "zod";
import {
  databaseSchema,
  statsSchema,
  locationSchema,
  leagueSlugSchema,
  seasonSchema,
  gameIdSchema,
  teamIdSchema,
  sortKeySchema,
  roleSchema,
  phaseSchema,
} from "./common";

/**
 * GET /api/stats/player/all-time
 * Query params: stats, location?, league?, season?, database
 */
export const playersAllTimeStatsQuerySchema = z.object({
  stats: statsSchema,
  location: locationSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
  database: databaseSchema,
  phase: phaseSchema,
});

/**
 * GET /api/stats/player/game
 * Query params: game, team
 */
export const playersGameStatsQuerySchema = z.object({
  game: gameIdSchema,
  team: teamIdSchema,
});

/**
 * GET /api/stats/player/records
 * Query params: database, location?, league?, season?, sortKey?
 */
export const playersRecordsQuerySchema = z.object({
  database: databaseSchema,
  location: locationSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
  sortKey: sortKeySchema,
  phase: phaseSchema,
});

/**
 * GET /api/stats/team/all-time
 * Query params: location?, league?, season?
 */
export const teamsAllTimeStatsQuerySchema = z.object({
  location: locationSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
  phase: phaseSchema,
});

/**
 * GET /api/stats/team/game
 * Query params: game, team
 */
export const teamsGameStatsQuerySchema = z.object({
  game: gameIdSchema,
  team: teamIdSchema,
});

/**
 * GET /api/stats/team/records
 * Query params: database, season?, league?, location?, sortKey?
 */
export const teamRecordsQuerySchema = z.object({
  database: databaseSchema,
  season: seasonSchema,
  league: leagueSlugSchema,
  location: locationSchema,
  sortKey: sortKeySchema,
  phase: phaseSchema,
});

/**
 * GET /api/stats/coach/all-time
 * Query params: database, role?, location?, league?, season?
 */
export const coachesAllTimeStatsQuerySchema = z.object({
  database: databaseSchema,
  role: roleSchema,
  location: locationSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
  phase: phaseSchema,
});

/**
 * GET /api/stats/referee/all-time
 * Query params: location?, league?, season?
 */
export const refereesAllTimeStatsQuerySchema = z.object({
  location: locationSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
  phase: phaseSchema,
});

/**
 * Two comma-separated entity IDs, e.g. "1,2"
 */
const compareIdsSchema = z
  .string()
  .regex(/^[^,]+,[^,]+$/, "ids must be exactly two comma-separated values");

/**
 * GET /api/stats/player/compare
 * Query params: ids, stats, location?, league?, season?
 */
export const playersCompareQuerySchema = z.object({
  ids: compareIdsSchema,
  stats: statsSchema,
  location: locationSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
});

/**
 * GET /api/stats/coach/compare
 * Query params: ids, location?, league?, season?
 */
export const coachesCompareQuerySchema = z.object({
  ids: compareIdsSchema,
  location: locationSchema,
  league: leagueSlugSchema,
  season: seasonSchema,
});
