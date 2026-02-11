/**
 *  service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::player-stats.player-stat",
  ({ strapi }) => ({
    async findPlayersAllTimeStats(stats, location, league, season, database) {
      const statsString = "_" + stats;
      const includeLocation = location && String(location).toLowerCase() !== "all";
      const locationString = includeLocation ? "_" + location : "";
      const includeLeague = league && String(league).toLowerCase() !== "all";
      const leagueString = includeLeague ? "_league" : "";
      const includeSeason = season && String(season).toLowerCase() !== "all";
      const seasonString = includeSeason ? "_season" : "";

      const table = `${database}_player${seasonString}${statsString}_all_time${leagueString}${locationString}`;

      const knex = strapi.db.connection;
      const query = knex(table).select("*").orderBy("points", "desc");

      if (league) {
        query.where("league_slug", league);
      }

      if (includeSeason) {
        query.where("season", season);
      }

      const data = await query;

      return data;
    },
  })
);
