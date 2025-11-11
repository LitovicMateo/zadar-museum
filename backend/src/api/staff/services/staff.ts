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

      try {
        let games: any[] = [];

        // try relation field 'staffers' first
        try {
          games = await strapi.db.query("api::game.game").findMany({
            where: { staffers: { id: staffId } },
            select: ["documentId"],
          });
        } catch (e) {
          // ignore
        }

        // fallback to relation field 'staff'
        if (!games || games.length === 0) {
          try {
            games = await strapi.db.query("api::game.game").findMany({
              where: { staff: { id: staffId } },
              select: ["documentId"],
            });
          } catch (e) {
            // ignore
          }
        }

        const documentIds = (games || [])
          .map((g) => g.documentId)
          .filter(Boolean);
        if (documentIds.length === 0) return [];

        const rows = await knex("schedule")
          .select("*")
          .whereIn("game_document_id", documentIds);
        return rows || [];
      } catch (err) {
        throw err;
      }
    },
  })
);
