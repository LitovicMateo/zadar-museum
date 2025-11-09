/**
 * competition controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::competition.competition",
  ({ strapi }) => ({
    async getLeagueDetails(ctx) {
      const { leagueSlug } = ctx.params;
      const service = strapi.service("api::competition.competition");
      const data = await service.findLeagueDetails(leagueSlug);
      ctx.body = data;
    },

    async getLeagueGames(ctx) {
      const { leagueSlug, season } = ctx.params;
      const service = strapi.service("api::competition.competition");
      const data = await service.findLeagueGames(leagueSlug, season);

      ctx.body = data;
    },

    async getLeagueSeasons(ctx) {
      const { leagueSlug } = ctx.params;
      const service = strapi.service("api::competition.competition");
      const data = await service.findLeagueSeasons(leagueSlug);
      const seasons = data
        .map((s: { season: string }) => s.season)
        .sort((a: string, b: string) => +b - +a);
      ctx.body = seasons;
    },

    async getPlayerLeagueRankings(ctx) {
      const { leagueSlug, stat } = ctx.params;
      const service = strapi.service("api::competition.competition");
      const data = await service.findPlayerLeagueRankings(leagueSlug, stat);
      ctx.body = data;
    },

    async getLeagueTeamRecord(ctx) {
      const { leagueSlug } = ctx.params;
      const service = strapi.service("api::competition.competition");
      const data = await service.findLeagueTeamRecord(leagueSlug);

      ctx.body = data;
    },

    async getTeamSeasonLeagueStats(ctx) {
      const { leagueSlug, season } = ctx.params;
      const service = strapi.service("api::competition.competition");
      const data = await service.findTeamSeasonLeagueStats(leagueSlug, season);
      ctx.body = data;
    },

    async getPlayerSeasonLeagueStats(ctx) {
      const { leagueSlug, season } = ctx.params;
      const service = strapi.service("api::competition.competition");
      const data = await service.findPlayerSeasonLeagueStats(
        leagueSlug,
        season
      );
      ctx.body = data;
    },
  })
);
