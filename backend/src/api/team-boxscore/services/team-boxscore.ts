export default {
  async find() {
    const knex = strapi.db.connection;
    return knex("team_boxscore").select("*");
  },

  async findByGameId(gameId: string | number) {
    const knex = strapi.db.connection;
    return knex("team_boxscore").select("*").where("game_id", gameId);
  },

  async findTeamUniqueSeasons(slug: string) {
    const knex = strapi.db.connection;
    return knex("schedule")
      .select("season")
      .distinct("season")
      .where("home_team_slug", slug)
      .orWhere("away_team_slug", slug);
  },

  async findTeamHeadToHead(slug: string) {
    const knex = strapi.db.connection;
    return knex("head_to_head").select("*").where("opponent_slug", slug);
  },
};
