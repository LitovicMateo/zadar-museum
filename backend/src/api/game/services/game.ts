/**
 * game service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::game.game", ({ strapi }) => ({
  async findGameDetails(gameId) {
    try {
      // Use an explicit populate object to ensure many-to-many relations
      // (like `staffers`) are properly expanded. Using a wildcard for each
      // relation guarantees nested fields are included.
      strapi.log.info(
        `[game.service] findGameDetails: fetching game documentId=${gameId}`
      );
      const result = await strapi.db.query("api::game.game").findOne({
        where: { documentId: gameId },
        populate: {
          home_team: true,
          away_team: true,
          competition: true,
          venue: true,
          mainReferee: true,
          secondReferee: true,
          thirdReferee: true,
          gallery: true,
          staffers: true,
        },
      });

      if (!result) {
        strapi.log.warn(
          `[game.service] findGameDetails: no game found for documentId=${gameId}`
        );
      } else {
        try {
          const staffInfo = Array.isArray(result.staffers)
            ? result.staffers.map((s: any) => ({
                id: s.id,
                documentId: s.documentId,
              }))
            : result.staffers;
          strapi.log.info(
            `[game.service] findGameDetails: staffers=${JSON.stringify(staffInfo)}`
          );
        } catch (e) {
          strapi.log.error(
            `[game.service] findGameDetails: failed to stringify staffers: ${e}`
          );
        }
      }

      return result;
    } catch (err) {
      throw err;
    }
  },

  async findGameTeamStats(gameId) {
    const knex = strapi.db.connection;
    try {
      return await knex("team_boxscore").select("*").where("game_id", gameId);
    } catch (err) {
      throw err;
    }
  },

  async findGameScore(gameId) {
    const knex = strapi.db.connection;
    try {
      return await knex("schedule")
        .select("*")
        .where("game_document_id", gameId);
    } catch (err) {
      throw err;
    }
  },

  async findGameBoxscore(gameId, teamSlug) {
    const knex = strapi.db.connection;
    try {
      return await knex("player_boxscore")
        .select("*")
        .where("game_id", gameId)
        .andWhere("team_slug", teamSlug);
    } catch (err) {
      throw err;
    }
  },

  async findTeamCoaches(gameId, teamSlug) {
    try {
      return await strapi.db.query("api::team-stats.team-stat").findOne({
        where: {
          game: { documentId: gameId }, // relation filter
          team: { slug: teamSlug }, // relation filter
        },
        populate: ["coach", "assistantCoach"],
      });
    } catch (err) {
      throw err;
    }
  },
}));
