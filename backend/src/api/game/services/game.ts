/**
 * game service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::game.game", ({ strapi }) => ({
  async findGameDetails(gameId) {
    try {
      return await strapi.db.query("api::game.game").findOne({
        where: { documentId: gameId },
        populate: [
          "home_team",
          "away_team",
          "competition",
          "venue",
          "mainReferee",
          "secondReferee",
          "thirdReferee",
          "gallery",
          "staffers",
        ],
      });
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
