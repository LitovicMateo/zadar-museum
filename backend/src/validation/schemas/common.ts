/**
 * Common validation schemas using Zod
 * These schemas wrap existing whitelist validators for consistency
 */
import { z } from "zod";
import {
  ALLOWED_DATABASES,
  ALLOWED_STATS,
  ALLOWED_LOCATIONS,
  ALLOWED_ROLES,
  ALLOWED_ENTITIES,
} from "../whitelists";

/**
 * Database parameter (zadar, opponent)
 */
export const databaseSchema = z.enum(
  ALLOWED_DATABASES as unknown as [string, ...string[]],
);

/**
 * Stats type (total, average, record)
 */
export const statsSchema = z.enum(
  ALLOWED_STATS as unknown as [string, ...string[]],
);

/**
 * Location (home, away, all) - optional
 */
export const locationSchema = z
  .enum(ALLOWED_LOCATIONS as unknown as [string, ...string[]])
  .optional()
  .nullable();

/**
 * Role (head, assistant, all) - optional
 */
export const roleSchema = z
  .enum(ALLOWED_ROLES as unknown as [string, ...string[]])
  .optional()
  .nullable();

/**
 * Entity type (player, coach, team)
 */
export const entitySchema = z.enum(
  ALLOWED_ENTITIES as unknown as [string, ...string[]],
);

/**
 * Season validation (YYYY format, 1900-2100) - optional
 */
export const seasonSchema = z
  .string()
  .regex(/^\d{4}$/, "Season must be in YYYY format (e.g., 2023)")
  .refine(
    (val) => {
      const year = parseInt(val, 10);
      return year >= 1900 && year <= 2100;
    },
    { message: "Season year must be between 1900 and 2100" },
  )
  .optional()
  .nullable();

/**
 * League slug validation (lowercase alphanumeric with hyphens, max 50 chars) - optional
 */
export const leagueSlugSchema = z
  .string()
  .regex(
    /^[a-z0-9-]+$/,
    "League slug must contain only lowercase letters, numbers, and hyphens",
  )
  .max(50, "League slug must be 50 characters or less")
  .optional()
  .nullable();

/**
 * Generic slug validation (team slug, venue slug, etc.)
 */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug must contain only lowercase letters, numbers, and hyphens",
  );

/**
 * Positive integer ID (player, coach, referee, etc.)
 */
export const numericIdSchema = z.coerce
  .number()
  .int("ID must be an integer")
  .positive("ID must be positive");

/**
 * Game ID (positive integer)
 */
export const gameIdSchema = z.coerce
  .number()
  .int("Game ID must be an integer")
  .positive("Game ID must be positive");

/**
 * Team ID (positive integer)
 */
export const teamIdSchema = z.coerce
  .number()
  .int("Team ID must be an integer")
  .positive("Team ID must be positive");

/**
 * Sort key for record tables - optional
 */
export const sortKeySchema = z.string().optional().nullable();

/**
 * Sort direction (asc, desc) - optional
 */
export const sortDirectionSchema = z
  .enum(["asc", "desc"] as const)
  .optional()
  .nullable();

/**
 * Competition type - optional
 */
export const competitionTypeSchema = z.string().optional().nullable();

/**
 * Team name string
 */
export const teamNameSchema = z.string().min(1, "Team name is required");

/**
 * Stat key for team leaders
 */
export const statKeySchema = z.string().min(1, "Stat key is required");
