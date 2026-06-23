let cached: string | null = null;

export async function getMainTeamSlug(): Promise<string> {
  if (cached) return cached;
  const result = await strapi.db.connection.raw(
    `SELECT slug FROM teams WHERE is_main_team = true LIMIT 1`
  );
  // Fallback to DEFAULT_MAIN_TEAM_SLUG until isMainTeam is set in Strapi admin panel after deploy.
  cached = result.rows[0]?.slug ?? process.env.DEFAULT_MAIN_TEAM_SLUG ?? 'kk-zadar';
  return cached;
}

export function invalidateMainTeamCache(): void {
  cached = null;
}
