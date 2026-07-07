/**
 * A set of functions called "actions" for `dashboard`
 */

import type { Core } from "@strapi/types";
import type { Context } from "koa";

type FactoryArgs = { strapi: Core.Strapi };

export default ({ strapi }: FactoryArgs) => ({
  async getSeasons(ctx) {
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findSeasons();
    ctx.body = data;
  },

  async getSeasonCompetitions(ctx: Context) {
    const { season } = ctx.params;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findSeasonCompetitions(season);
    ctx.body = data;
  },

  async getCompetitionGames(ctx: Context) {
    const { season, competition } = ctx.params;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findCompetitionGames(season, competition);
    ctx.body = data;
  },

  async getGameTeams(ctx: Context) {
    const { gameId } = ctx.params;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findGameTeams(gameId);
    ctx.body = data;
  },

  async getPlayers(ctx: Context) {
    const { sort, direction } = ctx.query;

    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findPlayers(sort, direction);
    ctx.body = data;
  },

  async getCoaches(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findCoaches(sort, direction);
    ctx.body = data;
  },

  async getReferees(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findReferees(sort, direction);
    ctx.body = data;
  },

  async getVenues(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findVenues(sort, direction);
    ctx.body = data;
  },

  async getTeams(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findTeams(sort, direction);
    ctx.body = data;
  },

  async getCompetitions(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findCompetitions(sort, direction);
    ctx.body = data;
  },

  async getGames(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findGames(sort, direction);
    ctx.body = data;
  },

  async getPlayerStats(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findPlayerStats(sort, direction);
    ctx.body = data;
  },

  async getTeamStats(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findTeamStats(sort, direction);
    ctx.body = data;
  },

  async getStaff(ctx: Context) {
    const { sort, direction } = ctx.query;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findStaff(sort, direction);
    ctx.body = data;
  },

  async getPlayersAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findPlayersAdmin({ sort, direction, page, pageSize, search });
  },

  async getCoachesAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findCoachesAdmin({ sort, direction, page, pageSize, search });
  },

  async getRefereesAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findRefereesAdmin({ sort, direction, page, pageSize, search });
  },

  async getStaffAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findStaffAdmin({ sort, direction, page, pageSize, search });
  },

  async getTeamsAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findTeamsAdmin({ sort, direction, page, pageSize, search });
  },

  async getVenuesAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findVenuesAdmin({ sort, direction, page, pageSize, search });
  },

  async getCompetitionsAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findCompetitionsAdmin({ sort, direction, page, pageSize, search });
  },

  async getGamesAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findGamesAdmin({ sort, direction, page, pageSize, search });
  },

  async getPlayerStatsAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findPlayerStatsAdmin({ sort, direction, page, pageSize, search });
  },

  async getTeamStatsAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findTeamStatsAdmin({ sort, direction, page, pageSize, search });
  },

  async getPlayerStatByIdAdmin(ctx: Context) {
    const { documentId } = ctx.params;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findPlayerStatByIdAdmin(documentId);
    if (!data) return ctx.notFound();
    ctx.body = { data };
  },

  async getTeamStatByIdAdmin(ctx: Context) {
    const { documentId } = ctx.params;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findTeamStatByIdAdmin(documentId);
    if (!data) return ctx.notFound();
    ctx.body = { data };
  },

  async getLeagueTablesAdmin(ctx: Context) {
    const { sort = "createdAt", direction = "desc", page = "1", pageSize = "20", search = "" } = ctx.query as Record<string, string>;
    const service = strapi.service("api::dashboard.dashboard");
    ctx.body = await service.findLeagueTablesAdmin({ sort, direction, page, pageSize, search });
  },

  async getLeagueTableByIdAdmin(ctx: Context) {
    const { documentId } = ctx.params;
    const service = strapi.service("api::dashboard.dashboard");
    const data = await service.findLeagueTableByIdAdmin(documentId);
    if (!data) return ctx.notFound();
    ctx.body = { data };
  },
});
