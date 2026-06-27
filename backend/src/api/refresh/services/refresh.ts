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

// Try CONCURRENT first; fall back to non-concurrent if the unique index check fails
// (can happen when duplicate source rows exist in the underlying data).
async function refreshView(knex: any, view: string): Promise<void> {
  try {
    await knex.raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${view}`);
  } catch (err: any) {
    if (err?.message?.includes('unique') || err?.message?.includes('duplicate')) {
      strapi.log.warn(
        `[refresh] CONCURRENT refresh failed for "${view}" (duplicate key); falling back to non-concurrent.`
      );
      await knex.raw(`REFRESH MATERIALIZED VIEW ${view}`);
    } else {
      strapi.log.error(`[refresh] Failed to refresh MV "${view}":`, err);
      throw err;
    }
  }
}

const refreshService = {
  /**
   * Refreshes all 4 Layer 1 materialized views concurrently in parallel,
   * then flushes the Redis cache.
   */
  async refreshAllViews(): Promise<RefreshResult> {
    const knex = strapi.db.connection;

    await Promise.all(
      LAYER_1_VIEWS.map((view) => refreshView(knex, view))
    );

    await flushCache();
    return { count: LAYER_1_VIEWS.length, refreshedViews: [...LAYER_1_VIEWS] };
  },

  /**
   * Refreshes a single named materialized view.
   */
  async refreshSingleView(name: string): Promise<void> {
    const knex = strapi.db.connection;
    await refreshView(knex, name);
  },
};

export default refreshService;
