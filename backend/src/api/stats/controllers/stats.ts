/**
 * A set of functions called "actions" for `stats`
 */

export default {
  async getPlayersAllTimeStats(ctx) {
    const { stats, location, league, season, database, phase } = ctx.query;

    const service = strapi.service("api::stats.stats");
    const data = await service.findPlayersAllTimeStats(
      stats,
      location,
      league,
      season,
      database,
      phase
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
    const { database, location, league, season, sortKey, phase } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findPlayersRecords(
      database,
      location,
      league,
      season,
      sortKey,
      phase
    );
    ctx.body = data;
  },

  async getTeamsAllTimeStats(ctx) {
    const { location, league, season, phase } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findTeamsAllTimeStats(location, league, season, phase);
    ctx.body = data;
  },

  async getTeamsGameStats(ctx) {
    const { game, team } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findTeamsGameStats(game, team);
    ctx.body = data;
  },

  async getTeamRecords(ctx) {
    const { database, season, league, location, sortKey, phase } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findTeamRecords(
      database,
      season,
      league,
      location,
      sortKey,
      phase
    );
    ctx.body = data;
  },

  async getCoachesAllTimeStats(ctx) {
    const { database, role, location, league, season, phase } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findCoachesAllTimeStats(
      database,
      role,
      location,
      league,
      season,
      phase
    );
    ctx.body = data;
  },

  async getRefereesAllTimeStats(ctx) {
    const { location, league, season, phase } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findRefereesAllTimeStats(
      location,
      league,
      season,
      phase
    );
    ctx.body = data;
  },

  async getPlayersCompareStats(ctx) {
    const { ids, stats, location, league, season } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findPlayersCompareStats(
      ids,
      stats,
      location,
      league,
      season
    );
    ctx.body = data;
  },

  async getPlayersRoster(ctx) {
    const service = strapi.service("api::stats.stats");
    const data = await service.findPlayersRoster();
    ctx.body = data;
  },

  async getCoachesCompareStats(ctx) {
    const { ids, location, league, season } = ctx.query;
    const service = strapi.service("api::stats.stats");
    const data = await service.findCoachesCompareStats(
      ids,
      location,
      league,
      season
    );
    ctx.body = data;
  },

  async getCoachesRoster(ctx) {
    const service = strapi.service("api::stats.stats");
    const data = await service.findCoachesRoster();
    ctx.body = data;
  },
};
