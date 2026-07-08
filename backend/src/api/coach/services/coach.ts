/**
 * coach service
 */

import { factories } from "@strapi/strapi";
import {
  validateWhitelist,
  validateSeason,
  ALLOWED_DATABASES,
} from "../../../validation";
import { getCached, TTL_24H, TTL_1H, CACHE_PREFIX } from "../../../utils/cache";
import {
  aggregateCoachRecord,
  buildRecord,
  type Phase,
} from "../../../lib/aggregation/queries";
import { getMainTeamSlug } from "../../../lib/mainTeam";
import type { Knex } from "knex";

// Stamps league identity onto each non-null row of a { total, home, away,
// neutral } group, since aggregateCoachRecord doesn't select it (it's a
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

// Computes a coach's { total, headCoach, assistantCoach } location records for
// one league + phase, or null when the coach has no games in that scope.
async function coachLeaguePhase(
  knex: Knex,
  args: {
    coachId: string;
    database: "main" | "opponent";
    league_id: any;
    league_slug: string;
    season?: string;
    phase: Phase;
  },
) {
  const { coachId, database, league_id, league_slug, season, phase } = args;
  const base = { coachId, database, league: league_slug, season, phase };
  const [total, headCoach, assistantCoach] = await Promise.all([
    buildRecord((location) =>
      aggregateCoachRecord(knex, { ...base, location }).then((r) => r[0] ?? null),
    ),
    buildRecord((location) =>
      aggregateCoachRecord(knex, { ...base, role: "head", location }).then((r) => r[0] ?? null),
    ),
    buildRecord((location) =>
      aggregateCoachRecord(knex, { ...base, role: "assistant", location }).then((r) => r[0] ?? null),
    ),
  ]);
  const anyRow = total.total ?? total.home ?? total.away ?? total.neutral;
  if (!anyRow) return null;
  return {
    total: stampLeague(total, league_id, league_slug),
    headCoach: stampLeague(headCoach, league_id, league_slug),
    assistantCoach: stampLeague(assistantCoach, league_id, league_slug),
    anyRow,
  };
}

// Assembles one per-league coach result with regular/playoff split.
async function coachLeagueResultWithSplit(
  knex: Knex,
  args: {
    coachId: string;
    database: "main" | "opponent";
    league_id: any;
    league_slug: string;
    season?: string;
  },
): Promise<Record<string, any> | null> {
  const { league_id, league_slug, season } = args;
  const [all, regular, playoff] = await Promise.all([
    coachLeaguePhase(knex, { ...args, phase: "all" }),
    coachLeaguePhase(knex, { ...args, phase: "regular" }),
    coachLeaguePhase(knex, { ...args, phase: "playoff" }),
  ]);
  if (!all) return null;
  const regularGames = Number(regular?.total.total?.games ?? 0);
  const playoffGames = Number(playoff?.total.total?.games ?? 0);
  return {
    coachId: all.anyRow.coach_id,
    firstName: all.anyRow.first_name,
    lastName: all.anyRow.last_name,
    ...(season ? { season } : {}),
    leagueId: league_id,
    leagueSlug: league_slug,
    total: all.total,
    headCoach: all.headCoach,
    assistantCoach: all.assistantCoach,
    regular: regular
      ? { total: regular.total, headCoach: regular.headCoach, assistantCoach: regular.assistantCoach }
      : null,
    playoff: playoff
      ? { total: playoff.total, headCoach: playoff.headCoach, assistantCoach: playoff.assistantCoach }
      : null,
    hasPhaseSplit: regularGames > 0 && playoffGames > 0,
  };
}

export default factories.createCoreService(
  "api::coach.coach",
  ({ strapi }) => ({
    async findCoachDetails(coachId) {
      const coach = await strapi.db.query("api::coach.coach").findOne({
        where: { documentId: coachId },
        populate: ["image"],
      });

      return coach;
    },

    async findCoachTeamRecord(coachId, db) {
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database") as "main" | "opponent";

      return getCached(
        `${CACHE_PREFIX}coach:team-record:${coachId}:${validatedDb}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          const [totalRecord, headRecord, assistantRecord] = await Promise.all([
            buildRecord((location) =>
              aggregateCoachRecord(knex, {
                coachId,
                database: validatedDb,
                location,
              }).then((r) => r[0] ?? null),
            ),
            buildRecord((location) =>
              aggregateCoachRecord(knex, {
                coachId,
                database: validatedDb,
                role: "head",
                location,
              }).then((r) => r[0] ?? null),
            ),
            buildRecord((location) =>
              aggregateCoachRecord(knex, {
                coachId,
                database: validatedDb,
                role: "assistant",
                location,
              }).then((r) => r[0] ?? null),
            ),
          ]);

          const anyRow =
            totalRecord.total ?? totalRecord.home ?? totalRecord.away ?? totalRecord.neutral;

          if (!anyRow) return null;

          return {
            coachId: anyRow.coach_id,
            firstName: anyRow.first_name,
            lastName: anyRow.last_name,
            total: totalRecord,
            headCoach: headRecord,
            assistantCoach: assistantRecord,
          };
        },
      );
    },

    async findCoachGamelog(coachId: string, db: string) {
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      const knex = strapi.db.connection;
      const mainSlug = await getMainTeamSlug();

      if (validatedDb === "main") {
        return await knex("schedule")
          .where(function () {
            // Coach led the main team at home
            this.where("home_team_slug", mainSlug).andWhere(function () {
              this.where("home_head_coach_id", coachId).orWhere(
                "home_assistant_coach_id",
                coachId,
              );
            });
          })
          .orWhere(function () {
            // Coach led the main team away
            this.where("away_team_slug", mainSlug).andWhere(function () {
              this.where("away_head_coach_id", coachId).orWhere(
                "away_assistant_coach_id",
                coachId,
              );
            });
          })
          .orderBy("game_date", "asc");
      } else {
        return await knex("schedule")
          .where(function () {
            // Coach led opponent at home (any team except main team)
            this.whereNot("home_team_slug", mainSlug).andWhere(function () {
              this.where("home_head_coach_id", coachId).orWhere(
                "home_assistant_coach_id",
                coachId,
              );
            });
          })
          .orWhere(function () {
            // Coach led opponent away (any team except main team)
            this.whereNot("away_team_slug", mainSlug).andWhere(function () {
              this.where("away_head_coach_id", coachId).orWhere(
                "away_assistant_coach_id",
                coachId,
              );
            });
          })
          .orderBy("game_date", "asc");
      }
    },

    async findCoachSeasons(coachId) {
      const knex = strapi.db.connection;
      return await knex("schedule")
        .select("season")
        .distinct("season")
        .where(function () {
          this.where("home_head_coach_id", coachId).orWhere(
            "home_assistant_coach_id",
            coachId,
          );
        })
        .orWhere(function () {
          this.where("away_head_coach_id", coachId).orWhere(
            "away_assistant_coach_id",
            coachId,
          );
        })
        .orderBy("season", "desc");
    },

    async findCoachSeasonCompetitions(coachId, season) {
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedSeason = validateSeason(season);

      const knex = strapi.db.connection;
      return await knex("schedule")
        .select("league_slug", "league_name", "league_id", "league_short_name")
        .distinct("league_slug")
        .where(function () {
          this.where("home_head_coach_id", coachId).orWhere(
            "home_assistant_coach_id",
            coachId,
          );
        })
        .orWhere(function () {
          this.where("away_head_coach_id", coachId).orWhere(
            "away_assistant_coach_id",
            coachId,
          );
        })
        .andWhere("season", validatedSeason);
    },

    async findCoachTeams(coachId) {
      const knex = strapi.db.connection;
      return knex("team_boxscore")
        .select("team_name", "team_slug")
        .distinct("team_slug")
        .where("head_coach_id", coachId)
        .orWhere("assistant_coach_id", coachId);
    },

    async findCoachLeagueRecord(coachId, db) {
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database") as "main" | "opponent";

      return getCached(
        `${CACHE_PREFIX}coach:league-record:${coachId}:${validatedDb}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          // Get distinct leagues this coach appeared in (via coach_boxscore)
          const mainSlug = await getMainTeamSlug();

          const leagueQuery = knex("coach_boxscore")
            .select("league_id", "league_slug")
            .distinct("league_id")
            .where("coach_id", coachId);

          if (validatedDb === "main") {
            leagueQuery.where("team_slug", mainSlug);
          } else {
            leagueQuery.whereNot("team_slug", mainSlug);
          }

          const leagues: { league_id: string; league_slug: string }[] = await leagueQuery;

          if (leagues.length === 0) return null;

          const leagueResults = await Promise.all(
            leagues.map(({ league_id, league_slug }) =>
              coachLeagueResultWithSplit(knex, {
                coachId,
                database: validatedDb,
                league_id,
                league_slug,
              }),
            ),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },

    async findCoachLeagueSeasonStats(coachId, season, db) {
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedSeason = validateSeason(season);
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database") as "main" | "opponent";

      return getCached(
        `${CACHE_PREFIX}coach:league-season-stats:${coachId}:${validatedSeason}:${validatedDb}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          // Get distinct leagues this coach appeared in during the given season
          const mainSlug = await getMainTeamSlug();

          const leagueQuery = knex("coach_boxscore")
            .select("league_id", "league_slug")
            .distinct("league_id")
            .where("coach_id", coachId)
            .where("season", validatedSeason);

          if (validatedDb === "main") {
            leagueQuery.where("team_slug", mainSlug);
          } else {
            leagueQuery.whereNot("team_slug", mainSlug);
          }

          const leagues: { league_id: string; league_slug: string }[] = await leagueQuery;

          if (leagues.length === 0) return null;

          const leagueResults = await Promise.all(
            leagues.map(({ league_id, league_slug }) =>
              coachLeagueResultWithSplit(knex, {
                coachId,
                database: validatedDb,
                league_id,
                league_slug,
                season: validatedSeason,
              }),
            ),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },

    async findCoachTotalSeasonStats(coachId, season, db) {
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedSeason = validateSeason(season);
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database") as "main" | "opponent";

      return getCached(
        `${CACHE_PREFIX}coach:total-season-stats:${coachId}:${validatedSeason}:${validatedDb}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          const [totalRecord, headRecord, assistantRecord] = await Promise.all([
            buildRecord((location) =>
              aggregateCoachRecord(knex, {
                coachId,
                database: validatedDb,
                location,
                season: validatedSeason,
              }).then((r) => r[0] ?? null),
            ),
            buildRecord((location) =>
              aggregateCoachRecord(knex, {
                coachId,
                database: validatedDb,
                role: "head",
                location,
                season: validatedSeason,
              }).then((r) => r[0] ?? null),
            ),
            buildRecord((location) =>
              aggregateCoachRecord(knex, {
                coachId,
                database: validatedDb,
                role: "assistant",
                location,
                season: validatedSeason,
              }).then((r) => r[0] ?? null),
            ),
          ]);

          const anyRow =
            totalRecord.total ?? totalRecord.home ?? totalRecord.away ?? totalRecord.neutral;

          if (!anyRow) return null;

          return {
            coachId: anyRow.coach_id,
            firstName: anyRow.first_name,
            lastName: anyRow.last_name,
            total: totalRecord,
            headCoach: headRecord,
            assistantCoach: assistantRecord,
          };
        },
      );
    },
  }),
);
