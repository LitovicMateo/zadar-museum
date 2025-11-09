// controllers/schedule.ts
export default {
  async find(ctx) {
    try {
      const data = await strapi.service("api::schedule.schedule").find();
      return data;
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async getSeasonSchedule(ctx) {
    const { season } = ctx.query;

    if (!season) {
      return ctx.badRequest("Season parameter is required");
    }

    try {
      const data = await strapi
        .service("api::schedule.schedule")
        .findBySeason(season);
      return data;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async getGameById(ctx) {
    const { gameId } = ctx.query;
    try {
      const data = await strapi
        .service("api::schedule.schedule")
        .findByGameId(gameId);
      return data;
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
