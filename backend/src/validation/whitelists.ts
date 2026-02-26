/**
 * Parameter whitelists for SQL table name construction
 * These values are safe to use in dynamic table name building
 */

export const ALLOWED_DATABASES = ["zadar", "opponent"] as const;
export type AllowedDatabase = (typeof ALLOWED_DATABASES)[number];

export const ALLOWED_STATS = ["total", "average", "record"] as const;
export type AllowedStats = (typeof ALLOWED_STATS)[number];

export const ALLOWED_LOCATIONS = ["home", "away", "all"] as const;
export type AllowedLocation = (typeof ALLOWED_LOCATIONS)[number];

export const ALLOWED_ROLES = ["head", "assistant", "all"] as const;
export type AllowedRole = (typeof ALLOWED_ROLES)[number];

export const ALLOWED_ENTITIES = ["player", "coach", "team"] as const;
export type AllowedEntity = (typeof ALLOWED_ENTITIES)[number];

/**
 * Validates if a value is in the allowed list
 */
export function validateWhitelist<T extends readonly string[]>(
  value: string | undefined | null,
  allowedValues: T,
  paramName: string,
): T[number] {
  if (!value) {
    throw new Error(`${paramName} is required`);
  }

  if (!allowedValues.includes(value as any)) {
    throw new Error(
      `Invalid ${paramName}: "${value}". Allowed values: ${allowedValues.join(", ")}`,
    );
  }

  return value as T[number];
}

/**
 * Optional whitelist validation - returns null if not provided
 */
export function validateOptionalWhitelist<T extends readonly string[]>(
  value: string | undefined | null,
  allowedValues: T,
  paramName: string,
): T[number] | null {
  if (!value) {
    return null;
  }

  if (!allowedValues.includes(value as any)) {
    throw new Error(
      `Invalid ${paramName}: "${value}". Allowed values: ${allowedValues.join(", ")}`,
    );
  }

  return value as T[number];
}

/**
 * Validates season format (YYYY or null)
 */
export function validateSeason(
  season: string | undefined | null,
): string | null {
  if (!season) {
    return null;
  }

  // Season should be 4-digit year
  if (!/^\d{4}$/.test(season)) {
    throw new Error(
      `Invalid season format: "${season}". Expected YYYY format (e.g., "2023")`,
    );
  }

  const year = parseInt(season, 10);
  if (year < 1900 || year > 2100) {
    throw new Error(
      `Invalid season year: "${season}". Must be between 1900 and 2100`,
    );
  }

  return season;
}

/**
 * Validates league slug format
 * League slugs should be lowercase alphanumeric with hyphens
 */
export function validateLeagueSlug(
  league: string | undefined | null,
): string | null {
  if (!league) {
    return null;
  }

  // League slug: lowercase letters, numbers, hyphens only
  if (!/^[a-z0-9-]+$/.test(league)) {
    throw new Error(
      `Invalid league slug: "${league}". Must contain only lowercase letters, numbers, and hyphens`,
    );
  }

  if (league.length > 50) {
    throw new Error(`League slug too long: "${league}". Maximum 50 characters`);
  }

  return league;
}
