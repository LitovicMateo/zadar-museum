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
import { aggregateCoachRecord, buildRecord } from "../../../lib/aggregation/queries";
import { getMainTeamSlug } from "../../../lib/mainTeam";

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
            leagues.map(async ({ league_id, league_slug }) => {
              const [totalRecord, headRecord, assistantRecord] = await Promise.all([
                buildRecord((location) =>
                  aggregateCoachRecord(knex, {
                    coachId,
                    database: validatedDb,
                    location,
                    league: league_slug,
                  }).then((r) => r[0] ?? null),
                ),
                buildRecord((location) =>
                  aggregateCoachRecord(knex, {
                    coachId,
                    database: validatedDb,
                    role: "head",
                    location,
                    league: league_slug,
                  }).then((r) => r[0] ?? null),
                ),
                buildRecord((location) =>
                  aggregateCoachRecord(knex, {
                    coachId,
                    database: validatedDb,
                    role: "assistant",
                    location,
                    league: league_slug,
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
                leagueId: league_id,
                leagueSlug: league_slug,
                total: totalRecord,
                headCoach: headRecord,
                assistantCoach: assistantRecord,
              };
            }),
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
            leagues.map(async ({ league_id, league_slug }) => {
              const [totalRecord, headRecord, assistantRecord] = await Promise.all([
                buildRecord((location) =>
                  aggregateCoachRecord(knex, {
                    coachId,
                    database: validatedDb,
                    location,
                    league: league_slug,
                    season: validatedSeason,
                  }).then((r) => r[0] ?? null),
                ),
                buildRecord((location) =>
                  aggregateCoachRecord(knex, {
                    coachId,
                    database: validatedDb,
                    role: "head",
                    location,
                    league: league_slug,
                    season: validatedSeason,
                  }).then((r) => r[0] ?? null),
                ),
                buildRecord((location) =>
                  aggregateCoachRecord(knex, {
                    coachId,
                    database: validatedDb,
                    role: "assistant",
                    location,
                    league: league_slug,
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
                season: validatedSeason,
                leagueId: league_id,
                leagueSlug: league_slug,
                total: totalRecord,
                headCoach: headRecord,
                assistantCoach: assistantRecord,
              };
            }),
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
