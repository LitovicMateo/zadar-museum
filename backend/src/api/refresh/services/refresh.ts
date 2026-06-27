/**
 * Refresh service
 *
 * Refreshes the 4 Layer 1 base materialized views concurrently in parallel,
 * then flushes the Redis cache so aggregated stats are recomputed on the next
 * request. See src/utils/cache.ts.
 *
 * Layer 1 MVs have unique indexes (added in Stage 1) which are required for
 * REFRESH MATERIALIZED VIEW CONCURRENTLY. They have no inter-dependencies that
 * prevent parallel execution, so all 4 are fired simultaneously via Promise.all.
 */

import { flushCache } from '../../../utils/cache';

interface RefreshResult {
  count: number;
  refreshedViews: string[];
}

const LAYER_1_VIEWS: readonly string[] = [
  'player_boxscore',
  'team_boxscore',
  'coach_boxscore',
  'schedule',
];

const refreshService = {
  /**
   * Refreshes all 4 Layer 1 materialized views concurrently in parallel,
   * then flushes the Redis cache.
   */
  async refreshAllViews(): Promise<RefreshResult> {
    const knex = strapi.db.connection;

    await Promise.all(
      LAYER_1_VIEWS.map((view) =>
        knex.raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${view}`)
      )
    );

    await flushCache();
    return { count: LAYER_1_VIEWS.length, refreshedViews: [...LAYER_1_VIEWS] };
  },

  /**
   * Refreshes a single named materialized view.
   */
  async refreshSingleView(name: string): Promise<void> {
    const knex = strapi.db.connection;
    try {
      await knex.raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${name}`);
    } catch (err: any) {
      strapi.log.error(`[refresh] Failed to refresh MV "${name}":`, err);
      throw err;
    }
  },
};

export default refreshService;
