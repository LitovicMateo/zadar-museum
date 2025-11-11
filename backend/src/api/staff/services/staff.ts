/**
 * staff service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::staff.staff" as any,
  ({ strapi }) => ({
    // Return schedule rows for games where the given staff member was involved.
    // Strategy:
    // 1. Query the `game` collection for games that reference the staff member (try relation fields like `staffers` or `staff`).
    // 2. Collect the games' `documentId`s.
    // 3. Query the `schedule` table and return rows where `game_document_id` is in that list.
    async getStaffSchedule(staffId: string) {
      const knex = strapi.db.connection;

      try {
        // Attempt to find games that have a relation to the staff member.
        // This will work if the game content-type has a relation field named `staffers` or `staff`.
        let games = [];

        try {
          games = await strapi.db.query("api::game.game").findMany({
            where: { staffers: { id: staffId } },
            select: ["documentId"],
          });
        } catch (e) {
          // ignore and try alternative below
        }

        if (!games || games.length === 0) {
          try {
            games = await strapi.db.query("api::game.game").findMany({
              where: { staff: { id: staffId } },
              select: ["documentId"],
            });
          } catch (e) {
            // ignore - fallback to empty
          }
        }

        const documentIds = (games || [])
          .map((g: any) => g.documentId)
          .filter(Boolean);

        if (documentIds.length === 0) {
          return [];
        }

        // Query schedule table for rows where game_document_id is in documentIds
        const rows = await knex("schedule")
          .select("*")
          .whereIn("game_document_id", documentIds);

        return rows;
      } catch (err) {
        throw err;
      }
    },
  })
);
