/**
 * coach service
 */

import { factories } from "@strapi/strapi";
import {
  validateWhitelist,
  validateSeason,
  ALLOWED_DATABASES,
} from "../../../validation";

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
      // Validate inputs
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      const table = `${validatedDb}_coach_record_full`;
      const knex = strapi.db.connection;
      const data = await knex(table).select("*").where("coach_id", coachId);

      if (data.length === 0) {
        return null;
      }

      const coach = data[0];

      return {
        coachId: coach.coach_id,
        firstName: coach.first_name,
        lastName: coach.last_name,
        total: JSON.parse(coach.total_record),
        headCoach: JSON.parse(coach.head_coach_record),
        assistantCoach: JSON.parse(coach.assistant_coach_record),
      };
    },

    async findCoachGamelog(coachId: string, db: string) {
      // Validate inputs
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      const knex = strapi.db.connection;

      if (validatedDb === "zadar") {
        return await knex("schedule")
          .where(function () {
            // Coach led Zadar at home
            this.where("home_team_slug", "kk-zadar").andWhere(function () {
              this.where("home_head_coach_id", coachId).orWhere(
                "home_assistant_coach_id",
                coachId,
              );
            });
          })
          .orWhere(function () {
            // Coach led Zadar away
            this.where("away_team_slug", "kk-zadar").andWhere(function () {
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
            // Coach led opponent at home (any team except KK Zadar)
            this.whereNot("home_team_slug", "kk-zadar").andWhere(function () {
              this.where("home_head_coach_id", coachId).orWhere(
                "home_assistant_coach_id",
                coachId,
              );
            });
          })
          .orWhere(function () {
            // Coach led opponent away (any team except KK Zadar)
            this.whereNot("away_team_slug", "kk-zadar").andWhere(function () {
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
      // Validate inputs
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedSeason = validateSeason(season);

      const knex = strapi.db.connection;
      return await knex("schedule")
        .select("league_slug", "league_name", "league_id")
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
      // Validate inputs
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      const knex = strapi.db.connection;
      const data = await knex(`${validatedDb}_coach_league_record_full`)
        .select("*")
        .where("coach_id", coachId);

      if (data.length === 0) {
        return null;
      }

      const coach = data.map((coach) => {
        return {
          coachId: coach.coach_id,
          firstName: coach.first_name,
          lastName: coach.last_name,
          total: JSON.parse(coach.total_record),
          headCoach: JSON.parse(coach.head_coach_record),
          assistantCoach: JSON.parse(coach.assistant_coach_record),
        };
      });

      return coach;
    },

    async findCoachLeagueSeasonStats(coachId, season, db) {
      // Validate inputs
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedSeason = validateSeason(season);
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      const knex = strapi.db.connection;
      const data = await knex(`${validatedDb}_coach_season_league_record_full`)
        .select("*")
        .where("coach_id", coachId)
        .andWhere("season", validatedSeason);

      if (data.length === 0) {
        return null;
      }

      const coach = data.map((coach) => {
        return {
          coachId: coach.coach_id,
          firstName: coach.first_name,
          lastName: coach.last_name,
          season: coach.season,
          total: JSON.parse(coach.total_record),
          headCoach: JSON.parse(coach.head_coach_record),
          assistantCoach: JSON.parse(coach.assistant_coach_record),
        };
      });

      return coach;
    },

    async findCoachTotalSeasonStats(coachId, season, db) {
      // Validate inputs
      if (!coachId) {
        throw new Error("Coach ID is required");
      }
      const validatedSeason = validateSeason(season);
      const validatedDb = validateWhitelist(db, ALLOWED_DATABASES, "database");

      const knex = strapi.db.connection;

      try {
        const data = await knex(`${validatedDb}_coach_season_record_full`)
          .select("*")
          .where("coach_id", coachId)
          .andWhere("season", validatedSeason);

        if (data.length === 0) {
          return null;
        }

        const coach = data[0];

        return {
          coachId: coach.coach_id,
          firstName: coach.first_name,
          lastName: coach.last_name,
          total: JSON.parse(coach.total_record),
          headCoach: JSON.parse(coach.head_coach_record),
          assistantCoach: JSON.parse(coach.assistant_coach_record),
        };
      } catch (err) {
        throw new Error(`Failed to fetch coach season stats: ${err.message}`);
      }
    },
  }),
);
