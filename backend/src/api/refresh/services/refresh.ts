/**
 * Refresh service
 *
 * Layer 1 MVs are pinned in LAYER_1_ORDER because their cross-dependencies
 * (e.g. `schedule` JOINs `team_boxscore`) are not recorded in pg_depend with
 * deptype 'n', so the recursive CTE cannot detect them. Without pinning,
 * both MVs land at depth 0 and sort alphabetically — placing `schedule`
 * before `team_boxscore` and causing it to read stale data on every refresh.
 *
 * Layer 2+ MVs are fully auto-discovered via pg_depend and require no
 * manual maintenance when new views are added.
 */

interface MatviewRow {
  name: string;
  depth: number;
}

interface RefreshResult {
  count: number;
  refreshedViews: string[];
  failedViews: string[];
}

/**
 * Layer 1 base MVs in their required execution order.
 * Only update this list when adding a new base (Layer 1) MV to the database.
 */
const LAYER_1_ORDER: readonly string[] = [
  'player_boxscore',
  'team_boxscore',
  'coach_boxscore',
  'schedule',
];

/**
 * Queries the PostgreSQL catalog for all MVs in the `public` schema except
 * Layer 1, ordered by longest dependency depth. Results are offset by 1 so
 * they always slot after the pinned Layer 1 bucket (depth 0).
 */
async function getOrderedMatviews(knex: any): Promise<Map<number, string[]>> {
  const placeholders = LAYER_1_ORDER.map(() => '?').join(', ');

  const query = `
    WITH RECURSIVE mv_deps AS (
      SELECT c.oid, c.relname AS name, 0 AS depth
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'm'
        AND n.nspname = 'public'
        AND c.relname NOT IN (${placeholders})

      UNION ALL

      SELECT dep_child.oid, dep_child.relname AS name, mv_deps.depth + 1
      FROM pg_depend d
      JOIN pg_class dep_child ON dep_child.oid = d.objid AND dep_child.relkind = 'm'
      JOIN pg_namespace n ON n.oid = dep_child.relnamespace AND n.nspname = 'public'
      JOIN mv_deps ON mv_deps.oid = d.refobjid
      WHERE d.deptype = 'n'
        AND dep_child.relname NOT IN (${placeholders})
    )
    SELECT name, MAX(depth) AS depth
    FROM mv_deps
    GROUP BY name
    ORDER BY depth ASC, name ASC;
  `;

  // LAYER_1_ORDER is passed twice — once per NOT IN clause
  const result = await knex.raw(query, [...LAYER_1_ORDER, ...LAYER_1_ORDER]);
  const rows: MatviewRow[] = result.rows;

  const grouped = new Map<number, string[]>();
  // Depth 0 = pinned Layer 1 in guaranteed order
  grouped.set(0, [...LAYER_1_ORDER]);

  // Offset auto-discovered depths by 1 so they always follow Layer 1
  for (const row of rows) {
    const level = row.depth + 1;
    const bucket = grouped.get(level) ?? [];
    bucket.push(row.name);
    grouped.set(level, bucket);
  }

  return grouped;
}

const refreshService = {
  /**
   * Refreshes all materialized views in the correct dependency order.
   *
   * Execution is intentionally sequential (one view at a time) even within
   * the same depth level. PostgreSQL's pg_depend catalog does not always
   * record every MV-to-MV JOIN dependency (e.g. `schedule` joins
   * `team_boxscore` but this may not appear as deptype 'n'), so parallel
   * execution within a depth bucket can cause a later MV to read stale data
   * from a concurrently-refreshing peer. Sequential execution eliminates
   * this race entirely.
   */
  async refreshAllViews(): Promise<RefreshResult> {
    const knex = strapi.db.connection;
    const ordered = await getOrderedMatviews(knex);

    const refreshedViews: string[] = [];
    const failedViews: string[] = [];

    for (const [depth, views] of [...ordered.entries()].sort(([a], [b]) => a - b)) {
      for (const view of views) {
        try {
          await knex.raw(`REFRESH MATERIALIZED VIEW "${view}";`);
          refreshedViews.push(view);
        } catch (err: any) {
          strapi.log.error(
            `[refresh] Failed to refresh MV "${view}" at depth ${depth}:`,
            err
          );
          failedViews.push(view);
          throw new Error(`Failed to refresh view "${view}": ${err.message}`);
        }
      }
    }

    return { count: refreshedViews.length, refreshedViews, failedViews };
  },

  /**
   * Refreshes a single named materialized view.
   */
  async refreshSingleView(name: string): Promise<void> {
    const knex = strapi.db.connection;
    try {
      await knex.raw(`REFRESH MATERIALIZED VIEW "${name}";`);
    } catch (err: any) {
      strapi.log.error(`[refresh] Failed to refresh MV "${name}":`, err);
      throw err;
    }
  },
};

export default refreshService;
