/**
 * game controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::game.game",
  ({ strapi }) => ({
    async findGames(ctx) {
      const { type, season, competition } = ctx.query;

      if (type === "seasons") {
        const seasons = await strapi.db.query("api::game.game").findMany({
          select: ["season"],
        });
        ctx.body = [...new Set(seasons.map((s) => s.season))];
        return;
      }

      if (type === "competitions" && season) {
        const games = await strapi.db.query("api::game.game").findMany({
          where: { season },
          populate: {
            competition: { fields: ["id", "name"] },
          },
        });
        const competitions = [
          ...new Map(
            games
              .filter((g) => g.competition)
              .map((g) => [g.competition.id, g.competition])
          ).values(),
        ];
        ctx.body = competitions;
        return;
      }

      if (type === "games" && season && competition) {
        const games = await strapi.db.query("api::game.game").findMany({
          where: { season, competition: { id: competition } },
          populate: ["competition", "teams", "home_team", "away_team"],
        });
        ctx.body = games;
        return;
      }

      ctx.throw(400, "Invalid query parameters");
    },

    async getGameDetails(ctx) {
      const { gameId } = ctx.params;

      try {
        const service = strapi.service("api::game.game");
        const data = await service.findGameDetails(gameId);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getGameTeamStats(ctx) {
      const { gameId } = ctx.params;
      try {
        const service = strapi.service("api::game.game");
        const data = await service.findGameTeamStats(gameId);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getGameScore(ctx) {
      const { gameId } = ctx.params;
      try {
        const service = strapi.service("api::game.game");
        const data = await service.findGameScore(gameId);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getGameBoxscore(ctx) {
      const { gameId, teamSlug } = ctx.params;
      try {
        const service = strapi.service("api::game.game");
        const data = await service.findGameBoxscore(gameId, teamSlug);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getTeamCoaches(ctx) {
      const { gameId, teamSlug } = ctx.params;
      try {
        const service = strapi.service("api::game.game");
        const data = await service.findTeamCoaches(gameId, teamSlug);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
