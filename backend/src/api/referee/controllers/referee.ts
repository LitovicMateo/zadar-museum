/**
 * referee controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::referee.referee",
  ({ strapi }) => ({
    async getRefereeDetails(ctx) {
      const { refereeId } = ctx.params;
      const service = strapi.service("api::referee.referee");
      const data = await service.findRefereeDetails(refereeId);
      ctx.body = data;
    },
    async getRefereeGamelog(ctx) {
      const { refereeId } = ctx.params;

      const service = strapi.service("api::referee.referee");
      const data = await service.findRefereeGamelog(refereeId);
      ctx.body = data;
    },

    async getRefereeTeamRecord(ctx) {
      const { refereeId } = ctx.params;

      const service = strapi.service("api::referee.referee");
      const data = await service.findRefereeTeamRecord(refereeId);
      ctx.body = data;
    },

    async getRefereeSeasons(ctx) {
      const { refereeId } = ctx.params;
      const service = strapi.service("api::referee.referee");
      const data = await service.findRefereeSeasons(refereeId);
      const seasons = data
        .map((s: { season: string }) => s.season)
        .sort((a: string, b: string) => +b - +a);

      ctx.body = seasons;
    },

    async getRefereeSeasonCompetitions(ctx) {
      const { refereeId, season } = ctx.params;
      const service = strapi.service("api::referee.referee");
      const data = await service.findRefereeSeasonCompetitions(
        refereeId,
        season
      );
      ctx.body = data;
    },

    async getRefereeSeasonStats(ctx) {
      const { refereeId, season } = ctx.params;
      const service = strapi.service("api::referee.referee");
      const data = await service.findRefereeSeasonStats(refereeId, season);
      ctx.body = data;
    },

    async getRefereeSeasonLeagueStats(ctx) {
      const { refereeId, season } = ctx.params;
      const service = strapi.service("api::referee.referee");
      const data = await service.findRefereeSeasonLeagueStats(
        refereeId,
        season
      );
      ctx.body = data;
    },
  })
);
