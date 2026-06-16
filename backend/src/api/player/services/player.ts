/**
 * player service
 */

import { factories } from "@strapi/strapi";
import {
  validateWhitelist,
  validateSeason,
  ALLOWED_DATABASES,
} from "../../../validation";
import { getCached, TTL_24H, TTL_1H } from "../../../utils/cache";
import { aggregatePlayerStats } from "../../../lib/aggregation/queries";
import { getMainTeamSlug } from "../../../lib/mainTeam";

export default factories.createCoreService(
  "api::player.player",
  ({ strapi }) => ({
    async findPlayersBoxscore(playerId, season) {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedSeason = validateSeason(season);

      return getCached(
        `zadar:player:boxscore:${playerId}:${validatedSeason}`,
        TTL_1H,
        () => {
          const knex = strapi.db.connection;
          return knex("player_boxscore")
            .select("*")
            .where("player_id", playerId)
            .andWhere("season", validatedSeason)
            .orderBy("game_date", "asc");
        },
      );
    },

    async findMostFrequentPlayerNumber(playerId: string | number) {
      return getCached(
        `zadar:player:shirt-number:${playerId}`,
        TTL_1H,
        async () => {
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
      );
    },

    async findPlayersAllTimeLeagueStats(playerId, db) {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      return getCached(
        `zadar:player:all-time-league:${playerId}:${validatedDb}`,
        TTL_24H,
        async () => {
          const table = `${validatedDb}_player_league_record_full`;
          const knex = strapi.db.connection;
          const data = await knex(table)
            .select("*")
            .where("player_id", playerId);

          if (data.length === 0) {
            return [];
          }

          return data.map((league) => {
            const total = JSON.parse(league.total);
            const average = JSON.parse(league.average);
            return { ...league, total, average };
          });
        },
      );
    },

    async findPlayersAllTimeStats(playerId, db) {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      return getCached(
        `zadar:player:all-time:${playerId}:${validatedDb}`,
        TTL_24H,
        async () => {
          const table = `${validatedDb}_player_record_full`;
          const knex = strapi.db.connection;
          const data = await knex(table)
            .select("*")
            .where("player_id", playerId);

          if (data.length === 0) {
            return [];
          }

          const player = data[0];
          const total = JSON.parse(player.total);
          const average = JSON.parse(player.average);

          return [{ ...player, total, average }];
        },
      );
    },

    async findPlayerSeasons(playerId, database) {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedDatabase = validateWhitelist(
        database,
        ALLOWED_DATABASES,
        "database",
      );

      return getCached(
        `zadar:player:seasons:${playerId}:${validatedDatabase}`,
        TTL_1H,
        () => {
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
      );
    },

    async findPlayerSeasonCompetitions(playerId, season) {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedSeason = validateSeason(season);

      return getCached(
        `zadar:player:season-competitions:${playerId}:${validatedSeason}`,
        TTL_1H,
        () => {
          const knex = strapi.db.connection;
          return knex("player_boxscore")
            .select(
              "league_id",
              "league_name",
              "league_slug",
              "league_short_name",
            )
            .distinct("league_id")
            .where("player_id", playerId)
            .andWhere("season", validatedSeason);
        },
      );
    },

    async findPlayerTeams(playerId) {
      return getCached(`zadar:player:teams:${playerId}`, TTL_1H, () => {
        const knex = strapi.db.connection;
        return knex("player_boxscore")
          .select("team_name", "team_slug")
          .distinct("team_slug")
          .where("player_id", playerId);
      });
    },

    async findCareerHighStats(playerId, database) {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedDatabase = validateWhitelist(
        database,
        ALLOWED_DATABASES,
        "database",
      );

      return getCached(
        `zadar:player:career-high:${playerId}:${validatedDatabase}`,
        TTL_24H,
        async () => {
          const mainSlug = await getMainTeamSlug();
          const knex = strapi.db.connection;

          const teamClause =
            validatedDatabase === "zadar"
              ? `b.team_slug = :mainSlug`
              : `b.team_slug != :mainSlug`;

          // For each stat, pick the single game row with the highest value
          // (earliest game date as tiebreaker, matching the Layer 2 MV behaviour).
          const sql = `
            WITH ranked AS (
              SELECT
                b.game_id,
                b.game_date,
                b.opponent_team_name,
                b.opponent_team_slug,
                b.points,
                b.rebounds,
                b.assists,
                b.steals,
                b.blocks,
                b.field_goals_made,
                b.three_pointers_made,
                b.free_throws_made,
                b.efficiency,
                ROW_NUMBER() OVER (ORDER BY b.points              DESC NULLS LAST, b.game_date ASC) AS rn_points,
                ROW_NUMBER() OVER (ORDER BY b.rebounds            DESC NULLS LAST, b.game_date ASC) AS rn_rebounds,
                ROW_NUMBER() OVER (ORDER BY b.assists             DESC NULLS LAST, b.game_date ASC) AS rn_assists,
                ROW_NUMBER() OVER (ORDER BY b.steals              DESC NULLS LAST, b.game_date ASC) AS rn_steals,
                ROW_NUMBER() OVER (ORDER BY b.blocks              DESC NULLS LAST, b.game_date ASC) AS rn_blocks,
                ROW_NUMBER() OVER (ORDER BY b.field_goals_made    DESC NULLS LAST, b.game_date ASC) AS rn_field_goals_made,
                ROW_NUMBER() OVER (ORDER BY b.three_pointers_made DESC NULLS LAST, b.game_date ASC) AS rn_three_pointers_made,
                ROW_NUMBER() OVER (ORDER BY b.free_throws_made    DESC NULLS LAST, b.game_date ASC) AS rn_free_throws_made,
                ROW_NUMBER() OVER (ORDER BY b.efficiency          DESC NULLS LAST, b.game_date ASC) AS rn_efficiency
              FROM player_boxscore b
              WHERE
                b.player_id = :playerId
                AND ${teamClause}
                AND b.status::text <> 'dnp-cd'::text
                AND b.is_nulled = false
            )
            SELECT
              (SELECT json_build_object('stat_value', r.points, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_points = 1 LIMIT 1) AS points,
              (SELECT json_build_object('stat_value', r.rebounds, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_rebounds = 1 LIMIT 1) AS rebounds,
              (SELECT json_build_object('stat_value', r.assists, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_assists = 1 LIMIT 1) AS assists,
              (SELECT json_build_object('stat_value', r.steals, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_steals = 1 LIMIT 1) AS steals,
              (SELECT json_build_object('stat_value', r.blocks, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_blocks = 1 LIMIT 1) AS blocks,
              (SELECT json_build_object('stat_value', r.field_goals_made, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_field_goals_made = 1 LIMIT 1) AS field_goals_made,
              (SELECT json_build_object('stat_value', r.three_pointers_made, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_three_pointers_made = 1 LIMIT 1) AS three_pointers_made,
              (SELECT json_build_object('stat_value', r.free_throws_made, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_free_throws_made = 1 LIMIT 1) AS free_throws_made,
              (SELECT json_build_object('stat_value', r.efficiency, 'game_id', r.game_id, 'opponent_team_name', r.opponent_team_name, 'opponent_team_slug', r.opponent_team_slug, 'game_date', r.game_date)
               FROM ranked r WHERE r.rn_efficiency = 1 LIMIT 1) AS efficiency
          `;

          const result = await knex.raw(sql, { playerId, mainSlug });
          const row = result.rows[0];

          return {
            playerId,
            points: row.points,
            rebounds: row.rebounds,
            assists: row.assists,
            steals: row.steals,
            blocks: row.blocks,
            field_goals_made: row.field_goals_made,
            three_pointers_made: row.three_pointers_made,
            free_throws_made: row.free_throws_made,
            efficiency: row.efficiency,
          };
        },
      );
    },

    async findSeasonAverageStats(playerId, season, database) {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedSeason = validateSeason(season);
      const validatedDatabase = validateWhitelist(
        database,
        ALLOWED_DATABASES,
        "database",
      );

      return getCached(
        `zadar:player:season-avg:${playerId}:${validatedSeason}:${validatedDatabase}`,
        TTL_24H,
        () => {
          const knex = strapi.db.connection;
          return aggregatePlayerStats(knex, {
            database: validatedDatabase as "zadar" | "opponent",
            stats: "average",
            location: "all",
            season: validatedSeason,
            playerId,
          });
        },
      );
    },

    async findSeasonAverageLeagueStats(playerId, season, database) {
      if (!playerId) {
        throw new Error("Player ID is required");
      }
      const validatedSeason = validateSeason(season);
      const validatedDatabase = validateWhitelist(
        database,
        ALLOWED_DATABASES,
        "database",
      );

      return getCached(
        `zadar:player:season-avg-league:${playerId}:${validatedSeason}:${validatedDatabase}`,
        TTL_24H,
        async () => {
          const mainSlug = await getMainTeamSlug();
          const knex = strapi.db.connection;

          const teamClause =
            validatedDatabase === "zadar"
              ? `b.team_slug = :mainSlug`
              : `b.team_slug != :mainSlug`;

          // Returns one row per league (same structure as the Layer 2 MV
          // zadar_player_season_average_all_time_league, grouped by league_id).
          const sql = `
            SELECT
              b.player_id,
              b.league_id,
              b.league_slug,
              b.first_name,
              b.last_name,
              b.season,

              COUNT(b.game_id) AS games,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY COUNT(b.game_id) DESC NULLS LAST) AS games_rank,
              SUM(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END) AS games_started,

              ROUND(AVG(b.minutes + (b.seconds / 60.0)), 1) AS minutes,

              ROUND(AVG(b.points), 1) AS points,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.points) DESC NULLS LAST) AS points_rank,

              ROUND(AVG(b.assists), 1) AS assists,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.assists) DESC NULLS LAST) AS assists_rank,

              ROUND(AVG(b.offensive_rebounds), 1) AS off_rebounds,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.offensive_rebounds) DESC NULLS LAST) AS off_rebounds_rank,

              ROUND(AVG(b.defensive_rebounds), 1) AS def_rebounds,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.defensive_rebounds) DESC NULLS LAST) AS def_rebounds_rank,

              ROUND(AVG(b.rebounds), 1) AS rebounds,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.rebounds) DESC NULLS LAST) AS rebounds_rank,

              ROUND(AVG(b.steals), 1) AS steals,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.steals) DESC NULLS LAST) AS steals_rank,

              ROUND(AVG(b.blocks), 1) AS blocks,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.blocks) DESC NULLS LAST) AS blocks_rank,

              ROUND(AVG(b.field_goals_made), 1) AS field_goals_made,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.field_goals_made) DESC NULLS LAST) AS field_goals_made_rank,

              ROUND(AVG(b.field_goals_attempted), 1) AS field_goals_attempted,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.field_goals_attempted) DESC NULLS LAST) AS field_goals_attempted_rank,

              CASE WHEN AVG(b.field_goals_attempted) = 0 THEN 0
                ELSE ROUND(AVG(b.field_goals_made) / NULLIF(AVG(b.field_goals_attempted), 0) * 100, 1)
              END AS field_goal_percentage,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY CASE WHEN AVG(b.field_goals_attempted) = 0 THEN 0 ELSE ROUND(AVG(b.field_goals_made) / NULLIF(AVG(b.field_goals_attempted), 0) * 100, 1) END DESC NULLS LAST) AS field_goal_percentage_rank,

              ROUND(AVG(b.three_pointers_made), 1) AS three_pointers_made,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.three_pointers_made) DESC NULLS LAST) AS three_pointers_made_rank,

              ROUND(AVG(b.three_pointers_attempted), 1) AS three_pointers_attempted,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.three_pointers_attempted) DESC NULLS LAST) AS three_pointers_attempted_rank,

              CASE WHEN AVG(b.three_pointers_attempted) = 0 THEN 0
                ELSE ROUND(AVG(b.three_pointers_made) / NULLIF(AVG(b.three_pointers_attempted), 0) * 100, 1)
              END AS three_point_percentage,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY CASE WHEN AVG(b.three_pointers_attempted) = 0 THEN 0 ELSE ROUND(AVG(b.three_pointers_made) / NULLIF(AVG(b.three_pointers_attempted), 0) * 100, 1) END DESC NULLS LAST) AS three_point_percentage_rank,

              ROUND(AVG(b.free_throws_made), 1) AS free_throws_made,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.free_throws_made) DESC NULLS LAST) AS free_throws_made_rank,

              ROUND(AVG(b.free_throws_attempted), 1) AS free_throws_attempted,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.free_throws_attempted) DESC NULLS LAST) AS free_throws_attempted_rank,

              CASE WHEN AVG(b.free_throws_attempted) = 0 THEN 0
                ELSE ROUND(AVG(b.free_throws_made) / NULLIF(AVG(b.free_throws_attempted), 0) * 100, 1)
              END AS free_throw_percentage,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY CASE WHEN AVG(b.free_throws_attempted) = 0 THEN 0 ELSE ROUND(AVG(b.free_throws_made) / NULLIF(AVG(b.free_throws_attempted), 0) * 100, 1) END DESC NULLS LAST) AS free_throw_percentage_rank,

              ROUND(AVG(b.efficiency), 1) AS efficiency,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.efficiency) DESC NULLS LAST) AS efficiency_rank

            FROM player_boxscore b
            WHERE
              b.player_id = :playerId
              AND ${teamClause}
              AND b.season = :season
              AND b.status::text <> 'dnp-cd'::text
              AND b.is_nulled = false
            GROUP BY b.player_id, b.first_name, b.last_name, b.league_id, b.league_slug, b.season
          `;

          const result = await knex.raw(sql, {
            playerId,
            mainSlug,
            season: validatedSeason,
          });
          return result.rows;
        },
      );
    },
  }),
);
