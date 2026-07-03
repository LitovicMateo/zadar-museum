/**
 * Refresh service
 *
 * Refreshes the 4 Layer 1 base materialized views concurrently in parallel,
 * then the dependent player_boxscore_unified view, then flushes the Redis cache
 * so aggregated stats are recomputed on the next request. See src/utils/cache.ts.
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
    const msg: string = err?.message ?? '';
    // CONCURRENTLY requires a unique index on the MV. It fails when the view has
    // no unique index ("...cannot refresh ... concurrently") or when duplicate
    // source rows break that index ("...unique"/"duplicate"). In every such case
    // fall back to a plain (blocking) refresh instead of failing the whole request.
    if (msg.includes('concurrently') || msg.includes('unique') || msg.includes('duplicate')) {
      strapi.log.warn(
        `[refresh] CONCURRENT refresh not possible for "${view}"; falling back to non-concurrent.`
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

    // player_boxscore_unified reads FROM player_boxscore, so it must be refreshed
    // AFTER the base views above. It has no unique index (aggregate lines have a
    // NULL game_id), so it can only be refreshed non-concurrently.
    await knex.raw('REFRESH MATERIALIZED VIEW public.player_boxscore_unified');

    await flushCache();

    const refreshedViews = [...LAYER_1_VIEWS, 'player_boxscore_unified'];
    return { count: refreshedViews.length, refreshedViews };
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
