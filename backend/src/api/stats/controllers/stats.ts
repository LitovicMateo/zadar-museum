/**
 * A set of functions called "actions" for `stats`
 */

export default {
  async getPlayersAllTimeStats(ctx) {
    const { stats, location, league, season, database } = ctx.query;

    const service = strapi.service("api::stats.stats");
    const data = await service.findPlayersAllTimeStats(
      stats,
      location,
      league,
      season,
      database
    );
    ctx.body = data;
  },

  async getPlayersGameStats(ctx) {
    const { game, team } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findPlayersGameStats(game, team);
    ctx.body = data;
  },

  async getPlayersRecords(ctx) {
    const { database, location, league, season, sortKey } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findPlayersRecords(
      database,
      location,
      league,
      season,
      sortKey
    );
    ctx.body = data;
  },

  async getTeamsAllTimeStats(ctx) {
    const { location, league, season } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findTeamsAllTimeStats(location, league, season);
    ctx.body = data;
  },

  async getTeamsGameStats(ctx) {
    const { game, team } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findTeamsGameStats(game, team);
    ctx.body = data;
  },

  async getTeamRecords(ctx) {
    const { database, season, league, location, sortKey } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findTeamRecords(
      database,
      season,
      league,
      location,
      sortKey
    );
    ctx.body = data;
  },

  async getCoachesAllTimeStats(ctx) {
    const { database, role, location, league, season } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findCoachesAllTimeStats(
      database,
      role,
      location,
      league,
      season
    );
    ctx.body = data;
  },

  async getRefereesAllTimeStats(ctx) {
    const { location, league, season } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findRefereesAllTimeStats(
      location,
      league,
      season
    );
    ctx.body = data;
  },
};
