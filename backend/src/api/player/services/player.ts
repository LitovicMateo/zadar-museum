/**
 * player service
 */

import { factories } from "@strapi/strapi";
import {
  validateWhitelist,
  validateSeason,
  ALLOWED_DATABASES,
} from "../../../validation";

export default factories.createCoreService(
  "api::player.player",
  ({ strapi }) => ({
    async findPlayersBoxscore(playerId, season) {
      // Validate inputs
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedSeason = validateSeason(season);

      const knex = strapi.db.connection;

      return await knex("player_boxscore")
        .select("*")
        .where("player_id", playerId)
        .andWhere("season", validatedSeason)
        .orderBy("game_date", "asc");
    },

    async findMostFrequentPlayerNumber(playerId: string | number) {
      const knex = strapi.db.connection;

      const result = await knex("player_boxscore")
        .select("shirt_number")
        .count("shirt_number as count")
        .where("player_id", playerId)
        .groupBy("shirt_number")
        .orderBy("count", "desc")
        .first();

      return result ? result.shirt_number : null;
    },

    async findPlayersAllTimeLeagueStats(playerId, db) {
      // Validate inputs
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      const table = `${validatedDb}_player_league_record_full`;
      const knex = strapi.db.connection;
      const data = await knex(table).select("*").where("player_id", playerId);

      if (data.length === 0) {
        return [];
      }

      const player = data.map((league) => {
        const total = JSON.parse(league.total);
        const average = JSON.parse(league.average);

        return {
          ...league,
          total,
          average,
        };
      });

      return player;
    },

    async findPlayersAllTimeStats(playerId, db) {
      // Validate inputs
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      const table = `${validatedDb}_player_record_full`;

      const knex = strapi.db.connection;
      const data = await knex(table).select("*").where("player_id", playerId);

      if (data.length === 0) {
        return [];
      }

      const player = data[0];

      const total = JSON.parse(player.total);
      const average = JSON.parse(player.average);

      return [
        {
          ...player,
          total,
          average,
        },
      ];
    },

    async findPlayerSeasons(playerId, database) {
      // Validate inputs
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedDatabase = validateWhitelist(
        database,
        ALLOWED_DATABASES,
        "database",
      );

      const knex = strapi.db.connection;

      if (validatedDatabase === "zadar") {
        return knex("player_boxscore")
          .distinct("season")
          .where("player_id", playerId)
          .andWhere("team_slug", "kk-zadar");
      }

      return knex("player_boxscore")
        .distinct("season")
        .where("player_id", playerId)
        .andWhereNot("team_slug", "kk-zadar");
    },

    async findPlayerSeasonCompetitions(playerId, season) {
      // Validate inputs
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedSeason = validateSeason(season);

      const knex = strapi.db.connection;
      return knex("player_boxscore")
        .select("league_id", "league_name", "league_slug")
        .distinct("league_id")
        .where("player_id", playerId)
        .andWhere("season", validatedSeason);
    },

    async findPlayerTeams(playerId) {
      const knex = strapi.db.connection;
      return knex("player_boxscore")
        .select("team_name", "team_slug")
        .distinct("team_slug")
        .where("player_id", playerId);
    },

    async findCareerHighStats(playerId, database) {
      // Validate inputs
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedDatabase = validateWhitelist(
        database,
        ALLOWED_DATABASES,
        "database",
      );

      const table = `${validatedDatabase}_player_career_high_aggregate`;
      const knex = strapi.db.connection;
      const data = await knex(table).select("*").where("player_id", playerId);
      const player = data[0];

      const points = JSON.parse(player.points);
      const rebounds = JSON.parse(player.rebounds);
      const assists = JSON.parse(player.assists);
      const steals = JSON.parse(player.steals);
      const blocks = JSON.parse(player.blocks);
      const field_goals_made = JSON.parse(player.field_goals_made);
      const three_pointers_made = JSON.parse(player.three_pointers_made);
      const free_throws_made = JSON.parse(player.free_throws_made);
      const efficiency = JSON.parse(player.efficiency);

      return {
        playerId: player.player_id,
        points,
        rebounds,
        assists,
        steals,
        blocks,
        field_goals_made,
        three_pointers_made,
        free_throws_made,
        efficiency,
      };
    },

    async findSeasonAverageStats(playerId, season, database) {
      // Validate inputs
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedSeason = validateSeason(season);
      const validatedDatabase = validateWhitelist(
        database,
        ALLOWED_DATABASES,
        "database",
      );

      const knex = strapi.db.connection;
      const table = `${validatedDatabase}_player_season_average_all_time`;
      return knex(table)
        .select("*")
        .where("player_id", playerId)
        .andWhere("season", validatedSeason);
    },

    async findSeasonAverageLeagueStats(playerId, season, database) {
      // Validate inputs
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedSeason = validateSeason(season);
      const validatedDatabase = validateWhitelist(
        database,
        ALLOWED_DATABASES,
        "database",
      );

      const knex = strapi.db.connection;
      const table = `${validatedDatabase}_player_season_average_all_time_league`;
      return knex(table)
        .select("*")
        .where("player_id", playerId)
        .andWhere("season", validatedSeason);
    },
  }),
);
