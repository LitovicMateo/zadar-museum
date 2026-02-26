/**
 * Validation schemas for Coach API endpoints
 */
import { z } from "zod";
import { numericIdSchema, databaseSchema, seasonSchema } from "./common";

/**
 * GET /api/coach/:coachId
 * Params: coachId
 */
export const coachIdParamsSchema = z.object({
  coachId: numericIdSchema,
});

/**
 * GET /api/coach/:coachId/stats/:db
 * Params: coachId, db
 */
export const coachDbParamsSchema = z.object({
  coachId: numericIdSchema,
  db: databaseSchema,
});

/**
 * GET /api/coach/:coachId/seasons
 * Params: coachId
 */
export const coachSeasonsParamsSchema = z.object({
  coachId: numericIdSchema,
});

/**
 * GET /api/coach/:coachId/season-competitions/:season
 * Params: coachId, season
 */
export const coachSeasonCompetitionsParamsSchema = z.object({
  coachId: numericIdSchema,
  season: seasonSchema,
});

/**
 * GET /api/coach/:coachId/career-high/:db
 * Params: coachId, db
 */
export const coachCareerHighParamsSchema = z.object({
  coachId: numericIdSchema,
  db: databaseSchema,
});

/**
 * GET /api/coach/:coachId/season-totals/:season/:db
 * Params: coachId, season, db
 */
export const coachSeasonTotalsParamsSchema = z.object({
  coachId: numericIdSchema,
  season: seasonSchema,
  db: databaseSchema,
});

/**
 * GET /api/coach/:coachId/league-totals/:season/:db
 * Params: coachId, season, db
 */
export const coachLeagueTotalsParamsSchema = z.object({
  coachId: numericIdSchema,
  season: seasonSchema,
  db: databaseSchema,
});

/**
 * GET /api/coach/:coachId/career-totals
 * Params: coachId
 */
export const coachCareerTotalsParamsSchema = z.object({
  coachId: numericIdSchema,
});

/**
 * GET /api/coach/:coachId/games/:season/:db
 * Params: coachId, season, db
 */
export const coachGamesParamsSchema = z.object({
  coachId: numericIdSchema,
  season: seasonSchema,
  db: databaseSchema,
});
