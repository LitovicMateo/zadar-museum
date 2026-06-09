/**
 * Validation schemas for Venue API endpoints
 */
import { z } from "zod";
import {
  ALLOWED_PLAYER_RECORD_STATS,
  ALLOWED_TEAM_RECORD_STATS,
} from "../whitelists";
import { slugSchema, seasonSchema } from "./common";

export const venueSlugParamsSchema = z.object({
  venueSlug: slugSchema,
});

/**
 * GET /venue/records/players/:venueSlug
 * Query params: statKey (player stat, required), season (optional)
 */
export const venuePlayerRecordsQuerySchema = z.object({
  statKey: z.enum(
    ALLOWED_PLAYER_RECORD_STATS as unknown as [string, ...string[]],
  ),
  season: seasonSchema,
});

/**
 * GET /venue/records/teams/:venueSlug
 * Query params: statKey (team stat, required), season (optional)
 */
export const venueTeamRecordsQuerySchema = z.object({
  statKey: z.enum(
    ALLOWED_TEAM_RECORD_STATS as unknown as [string, ...string[]],
  ),
  season: seasonSchema,
});
