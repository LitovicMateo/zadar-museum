/**
 * referee service
 */

import { factories } from "@strapi/strapi";
import { validateSeason } from "../../../validation";
import { getCached, TTL_24H, CACHE_PREFIX } from "../../../utils/cache";
import {
  aggregateRefereeStats,
  buildRecord,
  type Phase,
} from "../../../lib/aggregation/queries";
import type { Knex } from "knex";

// Stamps league identity onto each non-null row of a { total, home, away,
// neutral } group, since aggregateRefereeStats doesn't select it (it's a
// shared query also used without a league filter).
function stampLeague<T extends Record<string, any>>(
  group: { total: T | null; home: T | null; away: T | null; neutral: T | null },
  league_id: any,
  league_slug: string,
) {
  const stamp = (row: T | null) => (row ? { ...row, league_id, league_slug } : row);
  return {
    total: stamp(group.total),
    home: stamp(group.home),
    away: stamp(group.away),
    neutral: stamp(group.neutral),
  };
}

// Computes a referee's { total, home, away, neutral } record for one league +
// phase, or null when the referee officiated no games in that scope.
async function refereeLeaguePhase(
  knex: Knex,
  args: { refereeId: string; league_id: any; league_slug: string; season?: string; phase: Phase },
) {
  const { refereeId, league_id, league_slug, season, phase } = args;
  const rawRecord = await buildRecord((location) =>
    aggregateRefereeStats(knex, {
      refereeId,
      location,
      league: league_slug,
      season,
      phase,
    }).then((r) => r[0] ?? null),
  );
  const anyRow = rawRecord.total ?? rawRecord.home ?? rawRecord.away ?? rawRecord.neutral;
  if (!anyRow) return null;
  const record = stampLeague(rawRecord, league_id, league_slug);
  return { record, anyRow };
}

// Runs the three phases for one referee league and returns the combined record,
// the regular/playoff split records, and the hasPhaseSplit flag.
async function refereeLeaguePhaseSet(
  knex: Knex,
  args: { refereeId: string; league_id: any; league_slug: string; season?: string },
) {
  const [all, regular, playoff] = await Promise.all([
    refereeLeaguePhase(knex, { ...args, phase: "all" }),
    refereeLeaguePhase(knex, { ...args, phase: "regular" }),
    refereeLeaguePhase(knex, { ...args, phase: "playoff" }),
  ]);
  if (!all) return null;
  const regularGames = Number(regular?.record.total?.games ?? 0);
  const playoffGames = Number(playoff?.record.total?.games ?? 0);
  return {
    all,
    regular: regular?.record ?? null,
    playoff: playoff?.record ?? null,
    hasPhaseSplit: regularGames > 0 && playoffGames > 0,
  };
}

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
        `${CACHE_PREFIX}referee:team-record:${refereeId}`,
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
        `${CACHE_PREFIX}referee:season-stats:${refereeId}:${validatedSeason}`,
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
        `${CACHE_PREFIX}referee:season-league-stats:${refereeId}:${validatedSeason}`,
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
              const set = await refereeLeaguePhaseSet(knex, {
                refereeId,
                league_id,
                league_slug,
                season: validatedSeason ?? undefined,
              });
              if (!set) return null;
              const anyRow = set.all.anyRow;

              return {
                refereeId: anyRow.referee_id,
                firstName: anyRow.first_name,
                lastName: anyRow.last_name,
                season: validatedSeason,
                leagueId: league_id,
                leagueSlug: league_slug,
                stats: set.all.record,
                regular: set.regular,
                playoff: set.playoff,
                hasPhaseSplit: set.hasPhaseSplit,
              };
            }),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },

    async findRefereeLeagueStats(refereeId) {
      return getCached(
        `${CACHE_PREFIX}referee:league-stats:${refereeId}`,
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
              const set = await refereeLeaguePhaseSet(knex, { refereeId, league_id, league_slug });
              if (!set) return null;
              const anyRow = set.all.anyRow;

              return {
                refereeId: anyRow.referee_id,
                firstName: anyRow.first_name,
                lastName: anyRow.last_name,
                leagueId: league_id,
                leagueSlug: league_slug,
                total: set.all.record.total,
                home: set.all.record.home,
                away: set.all.record.away,
                neutral: set.all.record.neutral,
                regular: set.regular,
                playoff: set.playoff,
                hasPhaseSplit: set.hasPhaseSplit,
              };
            }),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },
  }),
);
