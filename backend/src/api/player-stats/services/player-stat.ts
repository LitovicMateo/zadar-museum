/**
 *  service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::player-stats.player-stat",
  ({ strapi }) => ({
    async findPlayersAllTimeStats(stats, location, league, season, database) {
      const statsString = "_" + stats;
      const locationString = location ? "_" + location : "";
      const leagueString = league ? "_league" : "";
      const seasonString = season ? "_season" : "";

      const table = `${database}_player${seasonString}${statsString}_all_time${leagueString}${locationString}`;

      const knex = strapi.db.connection;
      const query = knex(table).select("*").orderBy("points", "desc");

      if (league) {
        query.where("league_slug", league);
      }

      if (season) {
        query.where("season", season);
      }

      const data = await query;

      return data;
    },
  })
);
