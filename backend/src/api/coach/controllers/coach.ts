/**
 * coach controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::coach.coach",
  ({ strapi }) => ({
    async getCoachDetails(ctx) {
      const { coachId } = ctx.params;
      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachDetails(coachId);

      ctx.body = data;
    },
    async getCoachGamelog(ctx) {
      const { coachId, db } = ctx.params;
      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachGamelog(coachId, db);

      ctx.body = data;
    },

    async getCoachSeasons(ctx) {
      const { coachId } = ctx.params;
      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachSeasons(coachId);

      ctx.body = data;
    },

    async getCoachSeasonCompetitions(ctx) {
      const { coachId, season } = ctx.params;
      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachSeasonCompetitions(coachId, season);

      ctx.body = data;
    },

    async getCoachTeamRecord(ctx) {
      const { coachId, db } = ctx.params;
      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachTeamRecord(coachId, db);

      ctx.body = data;
    },

    async getCoachLeagueRecord(ctx) {
      const { coachId, db } = ctx.params;

      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachLeagueRecord(coachId, db);

      ctx.body = data;
    },

    async getCoachTeams(ctx) {
      const { coachId } = ctx.params;
      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachTeams(coachId);

      ctx.body = data;
    },

    async getCoachLeagueSeasonStats(ctx) {
      const { coachId, season, db } = ctx.params;
      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachLeagueSeasonStats(
        coachId,
        season,
        db
      );

      ctx.body = data;
    },

    async getCoachTotalSeasonStats(ctx) {
      const { coachId, season, db } = ctx.params;
      const service = strapi.service("api::coach.coach");
      const data = await service.findCoachTotalSeasonStats(coachId, season, db);

      ctx.body = data;
    },
  })
);
