// services/schedule.ts
export default {
  async find() {
    const knex = strapi.db.connection;
    return await knex("schedule").select("*");
  },

  async findBySeason(season) {
    const knex = strapi.db.connection;
    return await knex("schedule").select("*").where("season", season);
  },

  async findByGameId(gameId) {
    const knex = strapi.db.connection;
    return await knex("schedule").select("*").where("game_document_id", gameId);
  },
};
