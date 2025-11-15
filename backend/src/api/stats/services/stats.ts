/**
 * stats service
 */

export default ({ strapi }) => ({
  async findPlayersAllTimeStats(stats, location, league, season, database) {
    const statsString = "_" + stats;
    const locationString = location ? "_" + location : "";
    const leagueString = league ? "_league" : "";
    const seasonString = season ? "_season" : "";

    const table = `${database}_player${seasonString}${statsString}_all_time${leagueString}${locationString}`;

    strapi.log.info(`TABLE: ${table}`);
    strapi.log.info(`SEASON PARAM: ${season}, Type: ${typeof season}`);

    const knex = strapi.db.connection;
    const query = knex(table).select("*").orderBy("points", "desc");
    const prevQuery = knex(`${table}_prev`)
      .select("*")
      .orderBy("points", "desc");

    if (league) {
      query.where("league_slug", league);
      prevQuery.where("league_slug", league);
    }

    if (season) {
      strapi.log.info(`Adding WHERE season = ${season}`);
      query.where("season", season);
      prevQuery.where("season", season);
    }

    const querySQL = query.toSQL();
    strapi.log.info(`Query SQL: ${JSON.stringify(querySQL)}`);

    const data = await query;
    const prevData = await prevQuery;

    strapi.log.info(
      `Data count: ${data.length}, Prev data count: ${prevData.length}`
    );

    return {
      current: data,
      previous: prevData,
    };
  },

  async findPlayersGameStats(game, team) {
    if (!game || !team) {
      throw new Error("Game ID and Player ID are required");
    }

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
      }
    );

    return data;
  },

  async findPlayersRecords(database, location, league, season, sortKey) {
    const locationString = location ? "_" + location : "";
    const leagueString = league ? "_league" : "";
    const seasonString = season ? "_season" : "";

    const table = `${database}_player${seasonString}${leagueString}_record${locationString}`;

    const knex = strapi.db.connection;
    const query = knex(table).select("*").orderBy(sortKey, "desc");

    if (league) {
      query.where("league_slug", league);
    }

    if (season) {
      query.where("season", season);
    }

    const data = await query;

    if (!data) {
      return [];
    }

    return data;
  },
  async findTeamsAllTimeStats(location, league, season) {
    const locationString = location ? "_" + location : "";
    const leagueString = league ? "_league" : "";
    const seasonString = season ? "_season" : "";

    const table = `team${seasonString}${leagueString}_average_stats${locationString}`;
    const knex = strapi.db.connection;
    const query = knex(table)
      .select("*")
      .where("team_slug", "!=", "kk-zadar")
      .orderBy("games", "desc");

    if (league) {
      query.where("league_slug", league);
    }

    if (season) {
      query.where("season", season);
    }

    const data = await query;

    return data;
  },

  async findTeamsGameStats(game, team) {
    const data = await strapi.entityService.findMany(
      "api::team-stats.team-stat",
      {
        filters: {
          game: game,
          team: team,
        },
        populate: {
          game: {
            populate: {
              competition: true, // 👈 this tells Strapi to go one level deeper
            },
          },
          team: true,
          coach: true,
          assistantCoach: true,
        },
      }
    );

    return data;
  },

  async findTeamRecords(database, season, league, location, sortKey) {
    const locationString = location ? "_" + location : "";
    const leagueString = league ? "_league" : "";
    const seasonString = season ? "_season" : "";

    const table = `${database}_team${seasonString}${leagueString}_record${locationString}`;

    const knex = strapi.db.connection;
    const query = knex(table).select("*").orderBy(sortKey, "desc");

    if (league) {
      query.where("league_slug", league);
    }

    if (season) {
      query.where("season", season);
    }

    const data = await query;

    if (!data) {
      return [];
    }

    return data;
  },

  async findCoachesAllTimeStats(database, role, location, league, season) {
    const roleString = role ? "_" + role : "";
    const locationString = location ? "_" + location : "";
    const leagueString = league ? "_league" : "";
    const seasonString = season ? "_season" : "";

    const table = `${database}${roleString}_coach${seasonString}${leagueString}_record${locationString}`;

    const knex = strapi.db.connection;
    const query = knex(table).select("*").orderBy("games", "desc");
    const prevQuery = knex(`${table}_prev`)
      .select("*")
      .orderBy("games", "desc");

    if (league) {
      query.where("league_slug", league);
      prevQuery.where("league_slug", league);
    }

    if (season) {
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
    const locationString = location ? "_" + location : "";
    const leagueString = league ? "_league" : "";
    const seasonString = season ? "_season" : "";

    const table = `referee${seasonString}${leagueString}_stats${locationString}`;
    const knex = strapi.db.connection;
    const query = knex(table).select("*").orderBy("games", "desc");

    if (league) {
      query.where("league_slug", league);
    }

    if (season) {
      query.where("season", season);
    }

    const data = await query;

    return data;
  },
});
