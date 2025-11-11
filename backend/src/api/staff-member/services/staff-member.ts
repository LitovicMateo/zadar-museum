import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::staff-member.staff-member" as any,
  ({ strapi }) => ({
    async getStaffSchedule(staffMemberId: string) {
      const knex = strapi.db.connection as any;

      if (!staffMemberId) return [];

      try {
        let games: any[] = [];

        try {
          games = await strapi.db.query("api::game.game").findMany({
            where: { staffers: { id: staffMemberId } },
            select: ["documentId"],
          });
        } catch (e) {
          // ignore
        }

        if (!games || games.length === 0) {
          try {
            games = await strapi.db.query("api::game.game").findMany({
              where: { staff: { id: staffMemberId } },
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
