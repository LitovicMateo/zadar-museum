import { z } from "zod";

/**
 * Validation schemas for API endpoints
 */

// Common query schemas
export const PlayerBoxscoreQuerySchema = z.object({
  playerId: z.string().min(1, "Player ID is required"),
  season: z
    .string()
    .regex(/^\d{4}$/, "Season must be in YYYY format")
    .optional(),
});

export const StatsQuerySchema = z.object({
  stats: z.enum(["total", "average", "record"]),
  location: z.enum(["home", "away", "all"]).optional(),
  league: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(50)
    .optional(),
  season: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  database: z.enum(["zadar", "opponent"]),
});

export const TeamStatsQuerySchema = z.object({
  stats: z.enum(["total", "average", "record"]),
  location: z.enum(["home", "away", "all"]).optional(),
  league: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(50)
    .optional(),
  season: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  database: z.enum(["zadar", "opponent"]),
});

export const CoachStatsQuerySchema = z.object({
  stats: z.enum(["total", "average", "record"]),
  location: z.enum(["home", "away", "all"]).optional(),
  league: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(50)
    .optional(),
  season: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  database: z.enum(["zadar", "opponent"]),
  role: z.enum(["head", "assistant", "all"]).optional(),
});

export const CoachBoxscoreQuerySchema = z.object({
  coachId: z.string().min(1, "Coach ID is required"),
  season: z
    .string()
    .regex(/^\d{4}$/, "Season must be in YYYY format")
    .optional(),
  role: z.enum(["head", "assistant", "all"]).optional(),
});

export const TeamBoxscoreQuerySchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  season: z
    .string()
    .regex(/^\d{4}$/, "Season must be in YYYY format")
    .optional(),
});

// UUID validation for IDs
export const IdParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
});
