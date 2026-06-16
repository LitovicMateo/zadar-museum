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
import { aggregatePlayerStats, buildRecord } from "../../../lib/aggregation/queries";
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
          const mainSlug = await getMainTeamSlug();
          const knex = strapi.db.connection;

          const teamClause =
            validatedDb === "zadar"
              ? `b.team_slug = :mainSlug`
              : `b.team_slug != :mainSlug`;

          // Build a SQL query aggregating player stats per league per location.
          // Runs 8 times in parallel (4 locations × 2 modes).
          function buildLeagueLocationSql(
            mode: "total" | "average",
            location: "all" | "home" | "away" | "neutral",
          ): string {
            const isAvg = mode === "average";

            const minutesExpr = isAvg
              ? `ROUND(AVG(b.minutes + (b.seconds / 60.0)), 1)`
              : `SUM(b.minutes + (b.seconds / 60.0))`;

            function statCol(col: string): string {
              return isAvg ? `ROUND(AVG(b.${col}), 1)` : `SUM(b.${col})`;
            }

            function rankCol(col: string): string {
              const aggFn = isAvg ? `AVG(b.${col})` : `SUM(b.${col})`;
              return `RANK() OVER (PARTITION BY b.league_id ORDER BY ${aggFn} DESC NULLS LAST)`;
            }

            function pctCol(made: string, att: string): string {
              if (isAvg) {
                return `CASE WHEN AVG(b.${att}) = 0 THEN 0
                  ELSE ROUND(AVG(b.${made}) / NULLIF(AVG(b.${att}), 0) * 100, 1)
                END`;
              }
              return `CASE WHEN SUM(b.${att}) = 0 THEN 0
                ELSE ROUND(SUM(b.${made})::numeric / NULLIF(SUM(b.${att}), 0) * 100, 1)
              END`;
            }

            function pctRankCol(made: string, att: string): string {
              const expr = isAvg
                ? `CASE WHEN AVG(b.${att}) = 0 THEN 0 ELSE ROUND(AVG(b.${made}) / NULLIF(AVG(b.${att}), 0) * 100, 1) END`
                : `CASE WHEN SUM(b.${att}) = 0 THEN 0 ELSE ROUND(SUM(b.${made})::numeric / NULLIF(SUM(b.${att}), 0) * 100, 1) END`;
              return `RANK() OVER (PARTITION BY b.league_id ORDER BY ${expr} DESC NULLS LAST)`;
            }

            const locationClause =
              location !== "all"
                ? `AND b.is_home_team = '${location}'`
                : "";

            return `
              SELECT
                b.player_id,
                b.league_id,
                b.league_slug,
                b.first_name,
                b.last_name,
                BOOL_OR(b.is_active_player) AS is_active_player,

                COUNT(b.game_id) AS games,
                RANK() OVER (PARTITION BY b.league_id ORDER BY COUNT(b.game_id) DESC NULLS LAST) AS games_rank,
                SUM(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END) AS games_started,
                RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(CASE WHEN b.status::text = 'starter'::text THEN 1 ELSE 0 END) DESC NULLS LAST) AS games_started_rank,

                ${minutesExpr} AS minutes,
                RANK() OVER (PARTITION BY b.league_id ORDER BY ${minutesExpr} DESC NULLS LAST) AS minutes_rank,

                ${statCol("points")} AS points,
                ${rankCol("points")} AS points_rank,

                ${statCol("assists")} AS assists,
                ${rankCol("assists")} AS assists_rank,

                ${statCol("offensive_rebounds")} AS off_rebounds,
                ${rankCol("offensive_rebounds")} AS off_rebounds_rank,

                ${statCol("defensive_rebounds")} AS def_rebounds,
                ${rankCol("defensive_rebounds")} AS def_rebounds_rank,

                ${statCol("rebounds")} AS rebounds,
                ${rankCol("rebounds")} AS rebounds_rank,

                ${statCol("steals")} AS steals,
                ${rankCol("steals")} AS steals_rank,

                ${statCol("blocks")} AS blocks,
                ${rankCol("blocks")} AS blocks_rank,

                ${statCol("field_goals_made")} AS field_goals_made,
                ${rankCol("field_goals_made")} AS field_goals_made_rank,

                ${statCol("field_goals_attempted")} AS field_goals_attempted,
                ${rankCol("field_goals_attempted")} AS field_goals_attempted_rank,

                ${pctCol("field_goals_made", "field_goals_attempted")} AS field_goal_percentage,
                ${pctRankCol("field_goals_made", "field_goals_attempted")} AS field_goal_percentage_rank,

                ${statCol("three_pointers_made")} AS three_pointers_made,
                ${rankCol("three_pointers_made")} AS three_pointers_made_rank,

                ${statCol("three_pointers_attempted")} AS three_pointers_attempted,
                ${rankCol("three_pointers_attempted")} AS three_pointers_attempted_rank,

                ${pctCol("three_pointers_made", "three_pointers_attempted")} AS three_point_percentage,
                ${pctRankCol("three_pointers_made", "three_pointers_attempted")} AS three_point_percentage_rank,

                ${statCol("free_throws_made")} AS free_throws_made,
                ${rankCol("free_throws_made")} AS free_throws_made_rank,

                ${statCol("free_throws_attempted")} AS free_throws_attempted,
                ${rankCol("free_throws_attempted")} AS free_throws_attempted_rank,

                ${pctCol("free_throws_made", "free_throws_attempted")} AS free_throw_percentage,
                ${pctRankCol("free_throws_made", "free_throws_attempted")} AS free_throw_percentage_rank,

                ${statCol("efficiency")} AS efficiency,
                ${rankCol("efficiency")} AS efficiency_rank

              FROM player_boxscore b
              WHERE
                b.player_id = :playerId
                AND ${teamClause}
                AND b.status::text <> 'dnp-cd'::text
                AND b.is_nulled = false
                ${locationClause}
              GROUP BY b.player_id, b.first_name, b.last_name, b.league_id, b.league_slug
            `;
          }

          const bindings = { playerId, mainSlug };
          const locations = ["all", "home", "away", "neutral"] as const;

          const [totalResults, avgResults] = await Promise.all([
            Promise.all(
              locations.map((loc) =>
                knex
                  .raw(buildLeagueLocationSql("total", loc), bindings)
                  .then((r) => r.rows as any[]),
              ),
            ),
            Promise.all(
              locations.map((loc) =>
                knex
                  .raw(buildLeagueLocationSql("average", loc), bindings)
                  .then((r) => r.rows as any[]),
              ),
            ),
          ]);

          const [totalAll, totalHome, totalAway, totalNeutral] = totalResults;
          const [avgAll, avgHome, avgAway, avgNeutral] = avgResults;

          if (totalAll.length === 0) {
            return [];
          }

          // Build lookup maps keyed by league_id for each location/mode pair
          function byLeague(rows: any[]): Map<string, any> {
            return new Map(rows.map((r) => [r.league_id, r]));
          }

          const totalHomeMap = byLeague(totalHome);
          const totalAwayMap = byLeague(totalAway);
          const totalNeutralMap = byLeague(totalNeutral);
          const avgAllMap = byLeague(avgAll);
          const avgHomeMap = byLeague(avgHome);
          const avgAwayMap = byLeague(avgAway);
          const avgNeutralMap = byLeague(avgNeutral);

          return totalAll.map((totalRow) => {
            const leagueId = totalRow.league_id;
            return {
              player_id: totalRow.player_id,
              first_name: totalRow.first_name,
              last_name: totalRow.last_name,
              total: {
                total: totalRow,
                home: totalHomeMap.get(leagueId) ?? null,
                away: totalAwayMap.get(leagueId) ?? null,
                neutral: totalNeutralMap.get(leagueId) ?? null,
              },
              average: {
                total: avgAllMap.get(leagueId) ?? null,
                home: avgHomeMap.get(leagueId) ?? null,
                away: avgAwayMap.get(leagueId) ?? null,
                neutral: avgNeutralMap.get(leagueId) ?? null,
              },
            };
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
          const knex = strapi.db.connection;
          const baseParams = {
            database: validatedDb as "zadar" | "opponent",
            playerId,
          };

          const [totalRecord, avgRecord] = await Promise.all([
            buildRecord(async (location) => {
              const rows = await aggregatePlayerStats(knex, {
                ...baseParams,
                stats: "total",
                location,
              });
              return rows[0] ?? null;
            }),
            buildRecord(async (location) => {
              const rows = await aggregatePlayerStats(knex, {
                ...baseParams,
                stats: "average",
                location,
              });
              return rows[0] ?? null;
            }),
          ]);

          const anyRow =
            totalRecord.total ??
            totalRecord.home ??
            totalRecord.away ??
            totalRecord.neutral;
          if (!anyRow) return [];

          return [
            {
              player_id: anyRow.player_id,
              first_name: anyRow.first_name,
              last_name: anyRow.last_name,
              total: totalRecord,
              average: avgRecord,
            },
          ];
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
        async () => {
          const knex = strapi.db.connection;
          const mainTeamSlug = await getMainTeamSlug();

          if (validatedDatabase === "zadar") {
            return knex("player_boxscore")
              .distinct("season")
              .where("player_id", playerId)
              .andWhere("team_slug", mainTeamSlug);
          }

          return knex("player_boxscore")
            .distinct("season")
            .where("player_id", playerId)
            .andWhereNot("team_slug", mainTeamSlug);
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
