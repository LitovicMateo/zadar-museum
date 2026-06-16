/**
 * referee service
 */

import { factories } from "@strapi/strapi";
import { validateSeason } from "../../../validation";
import { getCached, TTL_24H } from "../../../utils/cache";
import { aggregateRefereeStats, buildRecord } from "../../../lib/aggregation/queries";

export default factories.createCoreService(
  "api::referee.referee",
  ({ strapi }) => ({
    async findRefereeDetails(refereeId) {
      const referee = await strapi.db.query("api::referee.referee").findOne({
        where: {
          documentId: refereeId,
        },
      });

      return referee;
    },

    async findRefereeGamelog(refereeId) {
      const knex = await strapi.db.connection;
      const id = String(refereeId);

      return knex("schedule")
        .select("*")
        .where(function () {
          this.where("main_referee_id", id)
            .orWhere("second_referee_id", id)
            .orWhere("third_referee_id", id);
        })
        .orderBy("game_date", "asc");
    },

    async findRefereeTeamRecord(refereeId) {
      return getCached(
        `zadar:referee:team-record:${refereeId}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          const record = await buildRecord((location) =>
            aggregateRefereeStats(knex, {
              refereeId,
              location,
            }).then((r) => r[0] ?? null),
          );

          const anyRow =
            record.total ?? record.home ?? record.away ?? record.neutral;

          if (!anyRow) return null;

          const toStatsRow = (row: any, key: string) =>
            row
              ? {
                  key,
                  games: row.games,
                  wins: row.wins,
                  losses: row.losses,
                  win_percentage: row.win_percentage,
                  fouls_for: row.fouls_for,
                  fouls_against: row.fouls_against,
                  foul_difference: row.foul_difference,
                }
              : null;

          const homeStats = toStatsRow(record.home, "Home");
          const awayStats = toStatsRow(record.away, "Away");
          const neutralStats = toStatsRow(record.neutral, "Neutral");
          const totalStats = toStatsRow(record.total, "Total");

          return {
            refereeId: anyRow.referee_id,
            firstName: anyRow.first_name,
            lastName: anyRow.last_name,
            stats: [homeStats, awayStats, neutralStats, totalStats].filter(Boolean),
          };
        },
      );
    },

    async findRefereeSeasons(refereeId) {
      const knex = await strapi.db.connection;
      return knex("schedule")
        .select("season")
        .distinct("season")
        .where("main_referee_id", refereeId)
        .orWhere("second_referee_id", refereeId)
        .orWhere("third_referee_id", refereeId)
        .orderBy("season", "desc");
    },

    async findRefereeSeasonCompetitions(refereeId, season) {
      const knex = await strapi.db.connection;
      return knex("schedule")
        .select("league_slug", "league_name", "league_id", "league_short_name")
        .distinct("league_slug")
        .where("main_referee_id", refereeId)
        .orWhere("second_referee_id", refereeId)
        .orWhere("third_referee_id", refereeId)
        .andWhere("season", season);
    },

    async findRefereeSeasonStats(refereeId, season) {
      const validatedSeason = validateSeason(season);

      return getCached(
        `zadar:referee:season-stats:${refereeId}:${validatedSeason}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          const rows = await aggregateRefereeStats(knex, {
            refereeId,
            location: "all",
            season: validatedSeason ?? undefined,
          });

          return rows;
        },
      );
    },

    async findRefereeSeasonLeagueStats(refereeId, season) {
      const validatedSeason = validateSeason(season);

      return getCached(
        `zadar:referee:season-league-stats:${refereeId}:${validatedSeason}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          // Get distinct leagues for this referee in this season
          const leagues: { league_id: string; league_slug: string }[] =
            await knex("schedule")
              .select("league_id", "league_slug")
              .distinct("league_id")
              .where(function () {
                this.where("main_referee_id", refereeId)
                  .orWhere("second_referee_id", refereeId)
                  .orWhere("third_referee_id", refereeId);
              })
              .andWhere("season", validatedSeason)
              .whereNotNull("league_id");

          if (leagues.length === 0) return null;

          const leagueResults = await Promise.all(
            leagues.map(async ({ league_id, league_slug }) => {
              const record = await buildRecord((location) =>
                aggregateRefereeStats(knex, {
                  refereeId,
                  location,
                  season: validatedSeason ?? undefined,
                  league: league_slug,
                }).then((r) => r[0] ?? null),
              );

              const anyRow =
                record.total ?? record.home ?? record.away ?? record.neutral;

              if (!anyRow) return null;

              return {
                refereeId: anyRow.referee_id,
                firstName: anyRow.first_name,
                lastName: anyRow.last_name,
                season: validatedSeason,
                leagueId: league_id,
                leagueSlug: league_slug,
                stats: {
                  total: record.total,
                  home: record.home,
                  away: record.away,
                  neutral: record.neutral,
                },
              };
            }),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },

    async findRefereeLeagueStats(refereeId) {
      return getCached(
        `zadar:referee:league-stats:${refereeId}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          // Get distinct leagues for this referee (all time)
          const leagues: { league_id: string; league_slug: string }[] =
            await knex("schedule")
              .select("league_id", "league_slug")
              .distinct("league_id")
              .where(function () {
                this.where("main_referee_id", refereeId)
                  .orWhere("second_referee_id", refereeId)
                  .orWhere("third_referee_id", refereeId);
              })
              .whereNotNull("league_id");

          if (leagues.length === 0) return null;

          const leagueResults = await Promise.all(
            leagues.map(async ({ league_id, league_slug }) => {
              const record = await buildRecord((location) =>
                aggregateRefereeStats(knex, {
                  refereeId,
                  location,
                  league: league_slug,
                }).then((r) => r[0] ?? null),
              );

              const anyRow =
                record.total ?? record.home ?? record.away ?? record.neutral;

              if (!anyRow) return null;

              return {
                refereeId: anyRow.referee_id,
                firstName: anyRow.first_name,
                lastName: anyRow.last_name,
                leagueId: league_id,
                leagueSlug: league_slug,
                total: record.total,
                home: record.home,
                away: record.away,
                neutral: record.neutral,
              };
            }),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },
  }),
);
