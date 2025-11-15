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
      .select("league_id", "league_name", "league_slug")
      .distinct("league_id")
      .where("season", season);
  },

  async findCompetitionGames(season, competition) {
    const games = await strapi.db.query("api::game.game").findMany({
      where: {
        season,
        competition: { documentId: competition },
        forfeited: false,
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
        "away_team_name"
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
      orderBy: {
        [sortKey]: direction,
      },
    });

    return referees;
  },

  async findVenues(sortKey, direction) {
    const venues = await strapi.db.query("api::venue.venue").findMany({
      select: ["*"],
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
      });

    return competitions;
  },

  async findGames(sortKey, direction) {
    const games = await strapi.db.query("api::game.game").findMany({
      select: ["*"],
      where: { forfeited: false },
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
      orderBy: {
        [sortKey]: direction,
      },
    });

    return staff;
  },
});
