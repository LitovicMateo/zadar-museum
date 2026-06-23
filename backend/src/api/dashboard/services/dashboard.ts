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
    const pg = Number(page);
    const ps = Number(pageSize);
    const offset = (pg - 1) * ps;

    if (search) {
      const knex = strapi.db.connection;
      const table = strapi.db.metadata.get("api::player.player" as any).tableName;
      const pattern = `%${search}%`;
      const sql = "unaccent(first_name || ' ' || last_name) ILIKE unaccent(?)";
      const snakeSort = sort.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`);
      const [rows, countResult] = await Promise.all([
        knex(table).whereRaw(sql, [pattern]).orderBy(snakeSort, direction).limit(ps).offset(offset).select("id"),
        knex(table).whereRaw(sql, [pattern]).count("id as count").first(),
      ]);
      const ids = (rows as { id: number }[]).map((r) => r.id);
      if (!ids.length) return { data: [], meta: { total: 0, page: pg, pageSize: ps } };
      const data = await strapi.db.query("api::player.player").findMany({
        where: { id: { $in: ids } },
        populate: ["image"],
        orderBy: { [sort]: direction },
      });
      return { data, meta: { total: Number((countResult as any)?.count ?? 0), page: pg, pageSize: ps } };
    }

    const [data, total] = await Promise.all([
      strapi.db.query("api::player.player").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        limit: ps,
        offset,
      }),
      strapi.db.query("api::player.player").count({}),
    ]);
    return { data, meta: { total, page: pg, pageSize: ps } };
  },

  async findCoachesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const pg = Number(page);
    const ps = Number(pageSize);
    const offset = (pg - 1) * ps;

    if (search) {
      const knex = strapi.db.connection;
      const table = strapi.db.metadata.get("api::coach.coach" as any).tableName;
      const pattern = `%${search}%`;
      const sql = "unaccent(first_name || ' ' || last_name) ILIKE unaccent(?)";
      const snakeSort = sort.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`);
      const [rows, countResult] = await Promise.all([
        knex(table).whereRaw(sql, [pattern]).orderBy(snakeSort, direction).limit(ps).offset(offset).select("id"),
        knex(table).whereRaw(sql, [pattern]).count("id as count").first(),
      ]);
      const ids = (rows as { id: number }[]).map((r) => r.id);
      if (!ids.length) return { data: [], meta: { total: 0, page: pg, pageSize: ps } };
      const data = await strapi.db.query("api::coach.coach").findMany({
        where: { id: { $in: ids } },
        populate: ["image"],
        orderBy: { [sort]: direction },
      });
      return { data, meta: { total: Number((countResult as any)?.count ?? 0), page: pg, pageSize: ps } };
    }

    const [data, total] = await Promise.all([
      strapi.db.query("api::coach.coach").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        limit: ps,
        offset,
      }),
      strapi.db.query("api::coach.coach").count({}),
    ]);
    return { data, meta: { total, page: pg, pageSize: ps } };
  },

  async findRefereesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const pg = Number(page);
    const ps = Number(pageSize);
    const offset = (pg - 1) * ps;

    if (search) {
      const knex = strapi.db.connection;
      const table = strapi.db.metadata.get("api::referee.referee" as any).tableName;
      const pattern = `%${search}%`;
      const sql = "unaccent(first_name || ' ' || last_name) ILIKE unaccent(?)";
      const snakeSort = sort.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`);
      const [rows, countResult] = await Promise.all([
        knex(table).whereRaw(sql, [pattern]).orderBy(snakeSort, direction).limit(ps).offset(offset).select("id"),
        knex(table).whereRaw(sql, [pattern]).count("id as count").first(),
      ]);
      const ids = (rows as { id: number }[]).map((r) => r.id);
      if (!ids.length) return { data: [], meta: { total: 0, page: pg, pageSize: ps } };
      const data = await strapi.db.query("api::referee.referee").findMany({
        where: { id: { $in: ids } },
        populate: ["image"],
        orderBy: { [sort]: direction },
      });
      return { data, meta: { total: Number((countResult as any)?.count ?? 0), page: pg, pageSize: ps } };
    }

    const [data, total] = await Promise.all([
      strapi.db.query("api::referee.referee").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        limit: ps,
        offset,
      }),
      strapi.db.query("api::referee.referee").count({}),
    ]);
    return { data, meta: { total, page: pg, pageSize: ps } };
  },

  async findStaffAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const pg = Number(page);
    const ps = Number(pageSize);
    const offset = (pg - 1) * ps;

    if (search) {
      const knex = strapi.db.connection;
      const table = strapi.db.metadata.get("api::staff.staff" as any).tableName;
      const pattern = `%${search}%`;
      const sql = "unaccent(first_name || ' ' || last_name) ILIKE unaccent(?)";
      const snakeSort = sort.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`);
      const [rows, countResult] = await Promise.all([
        knex(table).whereRaw(sql, [pattern]).orderBy(snakeSort, direction).limit(ps).offset(offset).select("id"),
        knex(table).whereRaw(sql, [pattern]).count("id as count").first(),
      ]);
      const ids = (rows as { id: number }[]).map((r) => r.id);
      if (!ids.length) return { data: [], meta: { total: 0, page: pg, pageSize: ps } };
      const data = await strapi.db.query("api::staff.staff").findMany({
        where: { id: { $in: ids } },
        populate: ["image"],
        orderBy: { [sort]: direction },
      });
      return { data, meta: { total: Number((countResult as any)?.count ?? 0), page: pg, pageSize: ps } };
    }

    const [data, total] = await Promise.all([
      strapi.db.query("api::staff.staff").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        limit: ps,
        offset,
      }),
      strapi.db.query("api::staff.staff").count({}),
    ]);
    return { data, meta: { total, page: pg, pageSize: ps } };
  },

  async findTeamsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const pg = Number(page);
    const ps = Number(pageSize);
    const offset = (pg - 1) * ps;

    if (search) {
      const knex = strapi.db.connection;
      const table = strapi.db.metadata.get("api::team.team" as any).tableName;
      const pattern = `%${search}%`;
      const sql = "unaccent(name) ILIKE unaccent(?)";
      const snakeSort = sort.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`);
      const [rows, countResult] = await Promise.all([
        knex(table).whereRaw(sql, [pattern]).orderBy(snakeSort, direction).limit(ps).offset(offset).select("id"),
        knex(table).whereRaw(sql, [pattern]).count("id as count").first(),
      ]);
      const ids = (rows as { id: number }[]).map((r) => r.id);
      if (!ids.length) return { data: [], meta: { total: 0, page: pg, pageSize: ps } };
      const data = await strapi.db.query("api::team.team").findMany({
        where: { id: { $in: ids } },
        populate: ["image"],
        orderBy: { [sort]: direction },
      });
      return { data, meta: { total: Number((countResult as any)?.count ?? 0), page: pg, pageSize: ps } };
    }

    const [data, total] = await Promise.all([
      strapi.db.query("api::team.team").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        limit: ps,
        offset,
      }),
      strapi.db.query("api::team.team").count({}),
    ]);
    return { data, meta: { total, page: pg, pageSize: ps } };
  },

  async findVenuesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const pg = Number(page);
    const ps = Number(pageSize);
    const offset = (pg - 1) * ps;

    if (search) {
      const knex = strapi.db.connection;
      const table = strapi.db.metadata.get("api::venue.venue" as any).tableName;
      const pattern = `%${search}%`;
      const sql = "unaccent(name) ILIKE unaccent(?)";
      const snakeSort = sort.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`);
      const [rows, countResult] = await Promise.all([
        knex(table).whereRaw(sql, [pattern]).orderBy(snakeSort, direction).limit(ps).offset(offset).select("id"),
        knex(table).whereRaw(sql, [pattern]).count("id as count").first(),
      ]);
      const ids = (rows as { id: number }[]).map((r) => r.id);
      if (!ids.length) return { data: [], meta: { total: 0, page: pg, pageSize: ps } };
      const data = await strapi.db.query("api::venue.venue").findMany({
        where: { id: { $in: ids } },
        populate: ["image"],
        orderBy: { [sort]: direction },
      });
      return { data, meta: { total: Number((countResult as any)?.count ?? 0), page: pg, pageSize: ps } };
    }

    const [data, total] = await Promise.all([
      strapi.db.query("api::venue.venue").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        limit: ps,
        offset,
      }),
      strapi.db.query("api::venue.venue").count({}),
    ]);
    return { data, meta: { total, page: pg, pageSize: ps } };
  },

  async findCompetitionsAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const pg = Number(page);
    const ps = Number(pageSize);
    const offset = (pg - 1) * ps;

    if (search) {
      const knex = strapi.db.connection;
      const table = strapi.db.metadata.get("api::competition.competition" as any).tableName;
      const pattern = `%${search}%`;
      const sql = "unaccent(name) ILIKE unaccent(?)";
      const snakeSort = sort.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`);
      const [rows, countResult] = await Promise.all([
        knex(table).whereRaw(sql, [pattern]).orderBy(snakeSort, direction).limit(ps).offset(offset).select("id"),
        knex(table).whereRaw(sql, [pattern]).count("id as count").first(),
      ]);
      const ids = (rows as { id: number }[]).map((r) => r.id);
      if (!ids.length) return { data: [], meta: { total: 0, page: pg, pageSize: ps } };
      const data = await strapi.db.query("api::competition.competition").findMany({
        where: { id: { $in: ids } },
        populate: ["image"],
        orderBy: { [sort]: direction },
      });
      return { data, meta: { total: Number((countResult as any)?.count ?? 0), page: pg, pageSize: ps } };
    }

    const [data, total] = await Promise.all([
      strapi.db.query("api::competition.competition").findMany({
        select: ["*"],
        populate: ["image"],
        orderBy: { [sort]: direction },
        limit: ps,
        offset,
      }),
      strapi.db.query("api::competition.competition").count({}),
    ]);
    return { data, meta: { total, page: pg, pageSize: ps } };
  },

  async findGamesAdmin({ sort = "createdAt", direction = "desc", page = 1, pageSize = 20, search = "" }: { sort?: string; direction?: string; page?: number | string; pageSize?: number | string; search?: string }) {
    const where = search
      ? { $or: [{ home_team_name: { $containsi: search } }, { away_team_name: { $containsi: search } }] }
      : {};
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
