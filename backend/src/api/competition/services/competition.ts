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
        return await knex("zadar_player_season_average_all_time_league")
          .select("*")
          .where("league_slug", leagueSlug)
          .andWhere("season", season)
          .orderBy("games", "desc");
      } catch (err) {
        console.log(err);
      }
    },
  })
);
