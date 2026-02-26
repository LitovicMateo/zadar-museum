/**
 * stats service
 */

export default ({ strapi }) => ({
  async findPlayersAllTimeStats(stats, location, league, season, database) {
    // Parameters already validated by middleware
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
    const prevQuery = knex(`${table}_prev`)
      .select("*")
      .orderBy("points", "desc");

    if (includeLeague) {
      query.where("league_slug", league);
      prevQuery.where("league_slug", league);
    }

    if (includeSeason) {
      query.where("season", season);
      prevQuery.where("season", season);
    }

    const data = await query;
    const prevData = await prevQuery;

    return {
      current: data,
      previous: prevData,
    };
  },

  async findPlayersGameStats(game, team) {
    // Parameters already validated by middleware
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
    // Parameters already validated by middleware
    const includeLocation = location && String(location).toLowerCase() !== "all";
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
  },

  async findTeamsAllTimeStats(location, league, season) {
    // Parameters already validated by middleware
    const includeLocation = location && String(location).toLowerCase() !== "all";
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

    const data = await query;

    return data;
  },

  async findTeamsGameStats(game) {
    // Parameters already validated by middleware
    const data = await strapi.entityService.findMany(
      "api::team-stats.team-stat",
      {
        filters: {
          game: { id: { $eq: game } },
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
    // Parameters already validated by middleware
    const includeLocation = location && String(location).toLowerCase() !== "all";
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

    const data = await query;

    return data;
  },

  async findCoachesAllTimeStats(database, role, location, league, season) {
    // Parameters already validated by middleware
    const includeRole = role && String(role).toLowerCase() !== "all";
    const roleString = includeRole ? "_" + role : "";
    const includeLocation = location && String(location).toLowerCase() !== "all";
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

    const data = await query;
    const prevData = await prevQuery;

    return {
      current: data,
      previous: prevData,
    };
  },

  async findRefereesAllTimeStats(location, league, season) {
    // Parameters already validated by middleware
    const includeLocation = location && String(location).toLowerCase() !== "all";
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

    const data = await query;

    return data;
  },
});
