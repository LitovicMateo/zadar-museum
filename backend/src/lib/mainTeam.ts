let cached: string | null = null;

export async function getMainTeamSlug(): Promise<string> {
  if (cached) return cached;
  const result = await strapi.db.connection.raw(
    `SELECT slug FROM teams WHERE is_main_team = true LIMIT 1`
  );
  cached = result.rows[0]?.slug ?? 'kk-zadar'; // fallback: kk-zadar during transition
  return cached;
}

export function invalidateMainTeamCache(): void {
  cached = null;
}
