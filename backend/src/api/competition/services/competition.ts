/**
 * competition service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::competition.competition",
  ({ strapi }) => ({
    async findLeagueDetails(leagueSlug) {
      const league = await strapi.db
        .query("api::competition.competition")
        .findOne({
          where: { slug: leagueSlug },
          populate: ["image"],
        });

      return league;
    },

    async findLeagueGames(leagueSlug, season) {
      const knex = strapi.db.connection;
      return await knex("schedule")
        .select("*")
        .where("league_slug", leagueSlug)
        .andWhere("season", season)
        .orderBy("game_date", "asc");
    },

    async findLeagueTeamRecord(leagueSlug) {
      const knex = strapi.db.connection;
      try {
        const data = await knex("team_all_time_league_record_full")
          .select("*")
          .where("league_slug", leagueSlug)
          .andWhere("team_slug", "kk-zadar");

        const team = data[0];

        const total = JSON.parse(team.total);
        const home = JSON.parse(team.home);
        const away = JSON.parse(team.away);

        return {
          teamId: team.team_id,
          teamSlug: team.team_slug,
          leagueId: team.league_id,
          leagueSlug: team.league_slug,
          stats: [home, away, total],
        };
      } catch (err) {
        console.log(err);
      }
    },

    async findLeagueSeasons(leagueSlug) {
      const knex = strapi.db.connection;
      try {
        return await knex("schedule")
          .select("season")
          .distinct("season")
          .where("league_slug", leagueSlug);
      } catch (err) {
        console.log(err);
      }
    },

    async findPlayerLeagueRankings(leagueSlug, stat) {
      const knex = strapi.db.connection;
      try {
        return await knex("zadar_player_total_all_time_league")
          .select("*")
          .where("league_slug", leagueSlug)
          .orderBy(stat, "desc");
      } catch (err) {
        console.log(err);
      }
    },

    async findCoachLeagueRankings(leagueSlug, stat) {
      const knex = strapi.db.connection;
      const allowedStats = [
        "games",
        "wins",
        "losses",
        "win_percentage",
        "points_scored",
        "points_received",
        "points_difference",
      ];
      if (!allowedStats.includes(stat)) {
        return [];
      }
      try {
        const rows = await knex("zadar_coach_league_record_full")
          .select("coach_id", "first_name", "last_name", "head_coach_record")
          .where("league_slug", leagueSlug)
          .whereRaw("(head_coach_record->'total'->>'games')::int > 0");

        const result = rows
          .map((row) => {
            const record =
              typeof row.head_coach_record === "string"
                ? JSON.parse(row.head_coach_record)
                : row.head_coach_record;
            const total = record?.total ?? {};
            return {
              coach_id: row.coach_id,
              first_name: row.first_name,
              last_name: row.last_name,
              games: total.games ?? 0,
              wins: total.wins ?? 0,
              losses: total.losses ?? 0,
              win_percentage: total.win_percentage ?? 0,
              points_scored: total.points_scored ?? 0,
              points_received: total.points_received ?? 0,
              points_difference: total.points_difference ?? 0,
            };
          })
          .sort((a, b) => b[stat] - a[stat]);

        return result;
      } catch (err) {
        console.log(err);
      }
    },

    async findTeamSeasonLeagueStats(leagueSlug, season) {
      const knex = strapi.db.connection;
      try {
        const data = await knex("team_all_time_league_season_record_full")
          .select("*")
          .where("league_slug", leagueSlug)
          .andWhere("team_slug", "kk-zadar")
          .andWhere("season", season);

        const team = data.map((t) => {
          const total = JSON.parse(t.total);
          const home = JSON.parse(t.home);
          const away = JSON.parse(t.away);

          return {
            teamId: t.team_id,
            teamSlug: t.team_slug,
            leagueId: t.league_id,
            leagueSlug: t.league_slug,
            season: t.season,
            stats: {
              total,
              home,
              away,
            },
          };
        });

        return team;
      } catch (err) {
        console.log(err);
      }
    },

    async findPlayerSeasonLeagueStats(leagueSlug, season) {
      const knex = strapi.db.connection;
      try {
        console.log(leagueSlug, season);
        return await knex("zadar_player_season_average_all_time_league")
          .select("*")
          .where("league_slug", leagueSlug)
          .andWhere("season", season)
          .orderBy("games", "desc");
      } catch (err) {
        console.log(err);
      }
    },
  }),
);
