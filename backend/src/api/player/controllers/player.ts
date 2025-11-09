/**
 * player controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::player.player",
  ({ strapi }) => ({
    async findPlayersBoxscore(ctx) {
      const { playerId, season } = ctx.query;

      try {
        const service = strapi.service("api::player.player");

        const data = await service.findPlayersBoxscore(playerId, season);

        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async findPlayersAllTimeLeagueStats(ctx) {
      const { playerId } = ctx.query;
      // pull db from params
      const { db } = ctx.params;

      try {
        const service = strapi.service("api::player.player");
        const data = await service.findPlayersAllTimeLeagueStats(playerId, db);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async findPlayersAllTimeStats(ctx) {
      const { playerId } = ctx.query;
      const { db } = ctx.params;

      try {
        const service = strapi.service("api::player.player");
        const data = await service.findPlayersAllTimeStats(playerId, db);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getMostFrequentPlayerNumber(ctx) {
      const { playerId } = ctx.params;
      try {
        const service = strapi.service("api::player.player");
        const number = await service.findMostFrequentPlayerNumber(playerId);
        ctx.body = { playerId, mostFrequentNumber: number };
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getPlayerSeasons(ctx) {
      const { playerId, database } = ctx.params;

      try {
        const service = strapi.service("api::player.player");
        const data = await service.findPlayerSeasons(playerId, database);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getPlayerSeasonCompetitions(ctx) {
      const { playerId, season } = ctx.params;
      try {
        const service = strapi.service("api::player.player");
        const data = await service.findPlayerSeasonCompetitions(
          playerId,
          season
        );
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getPlayerTeams(ctx) {
      const { playerId } = ctx.params;
      try {
        const service = strapi.service("api::player.player");
        const data = await service.findPlayerTeams(playerId);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getCareerHighStats(ctx) {
      const { playerId, database } = ctx.params;
      try {
        const service = strapi.service("api::player.player");
        const data = await service.findCareerHighStats(playerId, database);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getSeasonAverageStats(ctx) {
      const { playerId, database, season } = ctx.params;
      try {
        const service = strapi.service("api::player.player");
        const data = await service.findSeasonAverageStats(
          playerId,
          season,
          database
        );
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getSeasonAverageLeagueStats(ctx) {
      const { playerId, database, season } = ctx.params;
      try {
        const service = strapi.service("api::player.player");
        const data = await service.findSeasonAverageLeagueStats(
          playerId,
          season,
          database
        );
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
