/**
 * referee service
 */

import { factories } from "@strapi/strapi";

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
      return knex("schedule")
        .select("*")
        .where("main_referee_id", refereeId)
        .orWhere("second_referee_id", refereeId)
        .orWhere("third_referee_id", refereeId)
        .orderBy("game_date", "asc");
    },

    async findRefereeTeamRecord(refereeId) {
      const knex = await strapi.db.connection;
      const data = await knex("referee_all_time_record")
        .select("*")
        .where("referee_id", refereeId);

      const referee = data[0];

      if (!referee) {
        return null;
      }

      const totalStats = JSON.parse(referee.total);
      const homeStats = JSON.parse(referee.home);
      const awayStats = JSON.parse(referee.away);

      const stats = {
        refereeId: referee.referee_id,
        firstName: referee.first_name,
        lastName: referee.last_name,
        stats: [homeStats, awayStats, totalStats],
      };

      return stats;
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
        .select("league_slug", "league_name", "league_id")
        .distinct("league_slug")
        .where("main_referee_id", refereeId)
        .orWhere("second_referee_id", refereeId)
        .orWhere("third_referee_id", refereeId)
        .andWhere("season", season);
    },

    async findRefereeSeasonStats(refereeId, season) {
      const knex = await strapi.db.connection;
      return knex("referee_season_stats")
        .select("*")
        .where("referee_document_id", refereeId)
        .andWhere("season", season);
    },

    async findRefereeSeasonLeagueStats(refereeId, season) {
      const knex = strapi.db.connection;
      const data = await knex("referee_season_league_record_full")
        .select("*")
        .where("referee_id", refereeId)
        .andWhere("season", season);

      if (!data.length) {
        return null;
      }

      const referee = data.map((r) => {
        const totalStats = JSON.parse(r.total);
        const homeStats = JSON.parse(r.home);
        const awayStats = JSON.parse(r.away);

        return {
          refereeId: r.referee_id,
          firstName: r.first_name,
          lastName: r.last_name,
          season: r.season,
          leagueId: r.league_id,
          leagueSlug: r.league_slug,
          stats: {
            total: totalStats,
            home: homeStats,
            away: awayStats,
          },
        };
      });

      return referee;
    },
  })
);
