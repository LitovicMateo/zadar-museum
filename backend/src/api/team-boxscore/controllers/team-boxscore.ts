export default {
  async find(ctx) {
    try {
      const service = strapi.service("api::team-boxscore.team-boxscore");
      const data = await service.find();
      return data;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async getGameBoxscore(ctx) {
    const { gameId } = ctx.query;
    try {
      const service = strapi.service("api::team-boxscore.team-boxscore");
      const data = await service.findByGameId(gameId);
      return data;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async getTeamUniqueSeasons(ctx) {
    try {
      const { slug } = ctx.query;
      const service = strapi.service("api::team-boxscore.team-boxscore");
      const data = await service.findTeamUniqueSeasons(slug);
      ctx.body = data;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async getTeamHeadToHead(ctx) {
    try {
      const { teamSlug } = ctx.params;
      const service = strapi.service("api::team-boxscore.team-boxscore");
      const data = await service.findTeamHeadToHead(teamSlug);
      ctx.body = data;
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
