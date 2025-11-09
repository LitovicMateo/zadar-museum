/**
 * team controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::team.team",
  ({ strapi }) => ({
    async getTeamDetails(ctx) {
      const { teamSlug } = ctx.params;

      try {
        const service = await strapi.service("api::team.team");
        const data = await service.findTeamDetails(teamSlug);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
    async getTeamAllTimeStats(ctx) {
      const { teamSlug } = ctx.params;

      try {
        const service = strapi.service("api::team.team");
        const data = await service.findTeamAllTimeStats(teamSlug);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
    async getTeamSeasons(ctx) {
      const { teamSlug } = ctx.params;
      try {
        const service = strapi.service("api::team.team");
        const data = await service.getTeamSeasons(teamSlug);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getTeamCompetitions(ctx) {
      const { teamSlug } = ctx.params;
      try {
        const service = strapi.service("api::team.team");
        const data = await service.findTeamCompetitions(teamSlug);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getTeamSeasonCompetitions(ctx) {
      const { teamName, season } = ctx.query;

      try {
        const service = strapi.service("api::team.team");
        const data = await service.findTeamSeasonCompetitions(teamName, season);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getTeamLeagueStats(ctx) {
      const { teamSlug } = ctx.params;
      try {
        const service = strapi.service("api::team.team");
        const data = await service.getTeamLeagueStats(teamSlug);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
    async getTeamSchedule(ctx) {
      const { teamSlug, season } = ctx.params;
      try {
        const service = strapi.service("api::team.team");
        const data = await service.findTeamSchedule(teamSlug, season);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getTeamLeaders(ctx) {
      const { team, db, statKey, competitionSlug } = ctx.query;
      try {
        const service = strapi.service("api::team.team");
        const data = await service.findTeamLeaders(
          team,
          db,
          statKey,
          competitionSlug
        );
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getTeamSeasonLeagueStats(ctx) {
      const { teamSlug, season } = ctx.params;
      try {
        const service = strapi.service("api::team.team");
        const data = await service.findTeamSeasonLeagueStats(teamSlug, season);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async getTeamSeasonStats(ctx) {
      const { teamSlug, season } = ctx.params;
      try {
        const service = strapi.service("api::team.team");
        const data = await service.findTeamSeasonStats(teamSlug, season);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
