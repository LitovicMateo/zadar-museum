/**
 * staff service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::staff.staff" as any,
  ({ strapi }) => ({
    async getStaffSchedule(staffId: string) {
      const knex = strapi.db.connection as any;

      if (!staffId) return [];

      // The game content-type uses 'staffers' as the relation field name
      // (confirmed in game schema.json). Query via Strapi ORM so it resolves
      // the join table automatically, then fetch the schedule rows for those games.
      const games: { documentId: string }[] = await strapi.db
        .query("api::game.game")
        .findMany({
          where: { staffers: { documentId: staffId } },
          select: ["documentId"],
        });

      const documentIds = games.map((g) => g.documentId).filter(Boolean);
      if (documentIds.length === 0) return [];

      const rows = await knex("schedule")
        .select("*")
        .whereIn("game_document_id", documentIds)
        .orderBy("game_date", "asc");

      return rows ?? [];
    },
  })
);
