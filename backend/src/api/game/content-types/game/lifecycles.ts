type UpdateEvent = {
  params: { data: Record<string, unknown>; where?: Record<string, unknown> };
  state?: Record<string, unknown>;
};

/**
 * Resolves the numeric game ids targeted by an update, so the conversion below
 * can address the right team_stats rows.
 */
const resolveGameIds = async (where: Record<string, unknown> | undefined): Promise<number[]> => {
  if (!where) return [];
  const games = await strapi.db.query('api::game.game').findMany({ select: ['id'], where });
  return games.map((g: { id: number }) => g.id);
};

export default {
  async beforeUpdate(event: UpdateEvent) {
    const next = event.params.data.period_format;
    if (next !== 'quarters' && next !== 'halves') return;

    const ids = await resolveGameIds(event.params.where);
    if (ids.length === 0) return;

    // Stash the games whose format is actually changing, so afterUpdate only
    // converts those and a no-op save never touches stats.
    const changing = await strapi.db.connection('games')
      .select('id')
      .whereIn('id', ids)
      .andWhere((qb) => qb.where('period_format', '!=', next).orWhereNull('period_format'));

    event.state = event.state || {};
    event.state.periodFormatChangedFor = changing.map((g: { id: number }) => g.id);
    event.state.periodFormatNext = next;
  },

  async afterUpdate(event: UpdateEvent) {
    const ids = (event.state?.periodFormatChangedFor as number[]) || [];
    const next = event.state?.periodFormatNext as string | undefined;
    if (ids.length === 0 || !next) return;

    const statIds = strapi.db.connection('team_stats_game_lnk')
      .select('team_stat_id')
      .whereIn('game_id', ids);

    if (next === 'halves') {
      // Quarters -> halves: fold the quarters into halves. The total score is
      // preserved because team_boxscore sums both column families.
      await strapi.db.connection('team_stats')
        .whereIn('id', statIds)
        .update({
          first_half: strapi.db.connection.raw('COALESCE(first_quarter, 0) + COALESCE(second_quarter, 0)'),
          second_half: strapi.db.connection.raw('COALESCE(third_quarter, 0) + COALESCE(fourth_quarter, 0)'),
          first_quarter: null,
          second_quarter: null,
          third_quarter: null,
          fourth_quarter: null,
        });
    } else {
      // Halves -> quarters: a half cannot be split back into two quarters, so the
      // period scores are cleared and must be re-entered.
      await strapi.db.connection('team_stats')
        .whereIn('id', statIds)
        .update({ first_half: null, second_half: null });
    }
  },
};
