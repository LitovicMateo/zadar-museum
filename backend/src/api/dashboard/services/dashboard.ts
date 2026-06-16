/**
 * dashboard service
 */

import type { Core } from "@strapi/types";

type FactoryArgs = { strapi: Core.Strapi };

export default ({ strapi }: FactoryArgs) => ({
  async findSeasons() {
    const knex = strapi.db.connection;
    return await knex("schedule")
      .select("season")
      .distinct("season")
      .orderBy("season", "desc");
  },

  async findSeasonCompetitions(season) {
    const knex = strapi.db.connection;
    return await knex("schedule")
      .select("league_id", "league_name", "league_slug", "league_short_name")
      .distinct("league_id")
      .where("season", season);
  },

  async findCompetitionGames(season, competition) {
    const games = await strapi.db.query("api::game.game").findMany({
      where: {
        season,
        competition: { documentId: competition },
      },
      populate: ["competition", "teams", "home_team", "away_team"],
    });

    return games;
  },

  async findGameTeams(gameId) {
    const knex = strapi.db.connection;
    const game = await knex("schedule")
      .select(
        "game_id",
        "home_team_id",
        "home_team_name",
        "away_team_id",
        "away_team_name",
      )
      .where("game_id", gameId);

    const res = {
      gameId: gameId,
      teams: [
        { id: game[0].home_team_id, name: game[0].home_team_name },
        { id: game[0].away_team_id, name: game[0].away_team_name },
      ],
    };

    return res;
  },

  async findPlayers(sortKey, direction) {
    const players = await strapi.db.query("api::player.player").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: {
        [sortKey]: direction,
      },
    });

    return players;
  },

  async findCoaches(sortKey, direction) {
    const coaches = await strapi.db.query("api::coach.coach").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: {
        [sortKey]: direction,
      },
    });

    return coaches;
  },

  async findReferees(sortKey, direction) {
    const referees = await strapi.db.query("api::referee.referee").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: {
        [sortKey]: direction,
      },
    });

    return referees;
  },

  async findVenues(sortKey, direction) {
    const venues = await strapi.db.query("api::venue.venue").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: {
        [sortKey]: direction,
      },
    });

    return venues;
  },

  async findTeams(sortKey, direction) {
    const teams = await strapi.db.query("api::team.team").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: {
        [sortKey]: direction,
      },
    });

    return teams;
  },

  async findCompetitions(sortKey, direction) {
    const competitions = await strapi.db
      .query("api::competition.competition")
      .findMany({
        select: ["*"],
        orderBy: {
          [sortKey]: direction,
        },
        populate: ["image"],
      });

    return competitions;
  },

  async findGames(sortKey, direction) {
    const games = await strapi.db.query("api::game.game").findMany({
      select: ["*"],

      populate: ["home_team", "away_team"],
      orderBy: {
        [sortKey]: direction,
      },
    });

    return games;
  },

  async findPlayerStats(sortKey, direction) {
    const players = await strapi.db
      .query("api::player-stats.player-stat")
      .findMany({
        select: ["*"],
        populate: [
          "player",
          "team",
          "game",
          "game.home_team",
          "game.away_team",
        ],
        orderBy: {
          [sortKey]: direction,
        },
      });

    return players;
  },

  async findTeamStats(sortKey, direction) {
    const teams = await strapi.db.query("api::team-stats.team-stat").findMany({
      select: ["*"],
      populate: ["game", "game.home_team", "game.away_team", "coach", "team"],
      orderBy: {
        [sortKey]: direction,
      },
    });

    return teams;
  },

  async findStaff(sortKey, direction) {
    const staff = await strapi.db.query("api::staff.staff").findMany({
      select: ["*"],
      populate: ["image"],
      orderBy: {
        [sortKey]: direction,
      },
    });

    return staff;
  },

  async findPlayersAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { last_name: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::player.player").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::player.player").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findCoachesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { last_name: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::coach.coach").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::coach.coach").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findRefereesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { last_name: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::referee.referee").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::referee.referee").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findStaffAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { last_name: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::staff.staff").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::staff.staff").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findTeamsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { name: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::team.team").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::team.team").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findVenuesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { name: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::venue.venue").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::venue.venue").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findCompetitionsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { name: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::competition.competition").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::competition.competition").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findGamesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { season: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::game.game").findMany({
        select: ["*"],
        populate: ["home_team", "away_team"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::game.game").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findPlayerStatsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { season: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::player-stats.player-stat").findMany({
        select: ["*"],
        populate: ["player", "team", "game", "game.home_team", "game.away_team"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::player-stats.player-stat").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },

  async findTeamStatsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search ? { season: { $contains: search } } : {};
    const offset = (Number(page) - 1) * Number(pageSize);
    const [data, total] = await Promise.all([
      strapi.db.query("api::team-stats.team-stat").findMany({
        select: ["*"],
        populate: ["game", "game.home_team", "game.away_team", "coach", "team"],
        orderBy: { [sort]: direction },
        where,
        limit: Number(pageSize),
        offset,
      }),
      strapi.db.query("api::team-stats.team-stat").count({ where }),
    ]);
    return { data, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  },
});
