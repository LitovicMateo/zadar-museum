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
});
