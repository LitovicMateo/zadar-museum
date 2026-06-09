/**
 * stats service
 */

import { getCached, TTL_24H } from '../../../utils/cache';

export default ({ strapi }) => ({
  async findPlayersAllTimeStats(stats, location, league, season, database) {
    const cacheKey = `zadar:stats:players-all-time:${database}:${stats}:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      // Parameters already validated by middleware
      const statsString = "_" + stats;
      const includeLocation =
        location && String(location).toLowerCase() !== "all";
      const locationString = includeLocation ? "_" + location : "";
      const includeLeague = league && String(league).toLowerCase() !== "all";
      const leagueString = includeLeague ? "_league" : "";
      const includeSeason = season && String(season).toLowerCase() !== "all";
      const seasonString = includeSeason ? "_season" : "";

      const table = `${database}_player${seasonString}${statsString}_all_time${leagueString}${locationString}`;

      const knex = strapi.db.connection;
      const query = knex(table)
        .select(`${table}.*`, "players.is_active_player")
        .leftJoin("players", `${table}.player_id`, "players.document_id")
        .orderBy("points", "desc");
      const prevTable = `${table}_prev`;
      const prevQuery = knex(prevTable)
        .select(`${prevTable}.*`, "players.is_active_player")
        .leftJoin("players", `${prevTable}.player_id`, "players.document_id")
        .orderBy("points", "desc");

      if (includeLeague) {
        query.where("league_slug", league);
        prevQuery.where("league_slug", league);
      }

      if (includeSeason) {
        query.where("season", season);
        prevQuery.where("season", season);
      }

      const [data, prevData] = await Promise.all([query, prevQuery]);

      return {
        current: data,
        previous: prevData,
      };
    });
  },

  async findPlayersGameStats(game, team) {
    // Per-game queries are not cached — filtered by specific gameId + teamId
    const data = await strapi.entityService.findMany(
      "api::player-stats.player-stat",
      {
        filters: {
          game: { id: { $eq: game } },
          team: { id: { $eq: team } },
        },
        populate: {
          game: {
            populate: {
              competition: true,
            },
          },
          player: true,
          team: true,
        },
      },
    );

    return data;
  },

  async findPlayersRecords(database, location, league, season, sortKey) {
    const cacheKey = `zadar:stats:player-records:${database}:${location}:${league}:${season}:${sortKey || 'points'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      // Parameters already validated by middleware
      const includeLocation =
        location && String(location).toLowerCase() !== "all";
      const locationString = includeLocation ? "_" + location : "";
      const includeLeague = league && String(league).toLowerCase() !== "all";
      const leagueString = includeLeague ? "_league" : "";
      const includeSeason = season && String(season).toLowerCase() !== "all";
      const seasonString = includeSeason ? "_season" : "";

      const table = `${database}_player${seasonString}${leagueString}_record${locationString}`;

      const knex = strapi.db.connection;
      const query = knex(table)
        .select("*")
        .orderBy(sortKey || "points", "desc");

      if (includeLeague) {
        query.where("league_slug", league);
      }

      if (includeSeason) {
        query.where("season", season);
      }

      const data = await query;

      if (!data) {
        return [];
      }

      return data;
    });
  },

  async findTeamsAllTimeStats(location, league, season) {
    const cacheKey = `zadar:stats:teams-all-time:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      // Parameters already validated by middleware
      const includeLocation =
        location && String(location).toLowerCase() !== "all";
      const locationString = includeLocation ? "_" + location : "";
      const includeLeague = league && String(league).toLowerCase() !== "all";
      const leagueString = includeLeague ? "_league" : "";
      const includeSeason = season && String(season).toLowerCase() !== "all";
      const seasonString = includeSeason ? "_season" : "";

      const table = `team${seasonString}${leagueString}_average_stats${locationString}`;
      const knex = strapi.db.connection;
      const query = knex(table)
        .select("*")
        .where("team_slug", "!=", "kk-zadar")
        .orderBy("games", "desc");

      if (includeLeague) {
        query.where("league_slug", league);
      }

      if (includeSeason) {
        query.where("season", season);
      }

      return await query;
    });
  },

  async findTeamsGameStats(game, team) {
    // Per-game queries are not cached — filtered by specific gameId + teamId
    const data = await strapi.entityService.findMany(
      "api::team-stats.team-stat",
      {
        filters: {
          game: { id: { $eq: game } },
          team: { id: { $eq: team } },
        },
        populate: {
          game: {
            populate: {
              competition: true,
            },
          },
          team: true,
          coach: true,
          assistantCoach: true,
        },
      },
    );

    return data;
  },

  async findTeamRecords(database, season, league, location, sortKey) {
    const cacheKey = `zadar:stats:team-records:${database}:${season}:${league}:${location}:${sortKey || 'games'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      // Parameters already validated by middleware
      const includeLocation =
        location && String(location).toLowerCase() !== "all";
      const locationString = includeLocation ? "_" + location : "";
      const includeLeague = league && String(league).toLowerCase() !== "all";
      const leagueString = includeLeague ? "_league" : "";
      const includeSeason = season && String(season).toLowerCase() !== "all";
      const seasonString = includeSeason ? "_season" : "";

      const table = `${database}_team${seasonString}${leagueString}_record${locationString}`;

      const knex = strapi.db.connection;
      const query = knex(table)
        .select("*")
        .orderBy(sortKey || "games", "desc");

      if (includeLeague) {
        query.where("league_slug", league);
      }

      if (includeSeason) {
        query.where("season", season);
      }

      return await query;
    });
  },

  async findCoachesAllTimeStats(database, role, location, league, season) {
    const cacheKey = `zadar:stats:coaches-all-time:${database}:${role}:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      // Parameters already validated by middleware
      const includeRole = role && String(role).toLowerCase() !== "all";
      const roleString = includeRole ? "_" + role : "";
      const includeLocation =
        location && String(location).toLowerCase() !== "all";
      const locationString = includeLocation ? "_" + location : "";
      const includeLeague = league && String(league).toLowerCase() !== "all";
      const leagueString = includeLeague ? "_league" : "";
      const includeSeason = season && String(season).toLowerCase() !== "all";
      const seasonString = includeSeason ? "_season" : "";

      const table = `${database}${roleString}_coach${seasonString}${leagueString}_record${locationString}`;

      const knex = strapi.db.connection;
      const query = knex(table).select("*").orderBy("games", "desc");
      const prevQuery = knex(`${table}_prev`)
        .select("*")
        .orderBy("games", "desc");

      if (includeLeague) {
        query.where("league_slug", league);
        prevQuery.where("league_slug", league);
      }

      if (includeSeason) {
        query.where("season", season);
        prevQuery.where("season", season);
      }

      const [data, prevData] = await Promise.all([query, prevQuery]);

      return {
        current: data,
        previous: prevData,
      };
    });
  },

  async findRefereesAllTimeStats(location, league, season) {
    const cacheKey = `zadar:stats:referees-all-time:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      // Parameters already validated by middleware
      const includeLocation =
        location && String(location).toLowerCase() !== "all";
      const locationString = includeLocation ? "_" + location : "";
      const includeLeague = league && String(league).toLowerCase() !== "all";
      const leagueString = includeLeague ? "_league" : "";
      const includeSeason = season && String(season).toLowerCase() !== "all";
      const seasonString = includeSeason ? "_season" : "";

      const table = `referee${seasonString}${leagueString}_stats${locationString}`;
      const knex = strapi.db.connection;
      const query = knex(table).select("*").orderBy("games", "desc");

      if (includeLeague) {
        query.where("league_slug", league);
      }

      if (includeSeason) {
        query.where("season", season);
      }

      return await query;
    });
  },
});
