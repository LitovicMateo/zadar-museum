/**
 * venue service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::venue.venue",
  ({ strapi }) => ({
    async findVenueDetails(venueSlug) {
      return await strapi.db.query("api::venue.venue").findOne({
        where: { slug: venueSlug },
      });
    },

    async findVenueGamelog(venueSlug, season) {
      const knex = strapi.db.connection;
      return await knex("schedule")
        .select("*")
        .where("venue_slug", venueSlug)
        .andWhere("season", season)
        .orderBy("game_date", "asc");
    },

    async findVenueTeamRecord(venueSlug) {
      const knex = strapi.db.connection;
      return await knex("zadar_venue_record")
        .select("*")
        .where("venue_slug", venueSlug);
    },

    async findVenueSeasons(venueSlug) {
      const knex = strapi.db.connection;

      return await knex("schedule")
        .select("season")
        .distinct("season")
        .where("venue_slug", venueSlug);
    },

    async findVenueSeasonCompetitions(venueSlug, season) {
      const knex = strapi.db.connection;
      return await knex("schedule")
        .select("league_slug", "league_name", "league_id", "league_short_name")
        .distinct("league_slug")
        .where("venue_slug", venueSlug)
        .andWhere("season", season);
    },

    async findVenueSeasonStats(venueSlug, season) {
      const knex = strapi.db.connection;
      return await knex("zadar_venue_season_record")
        .select("*")
        .where("venue_slug", venueSlug)
        .andWhere("season", season);
    },

    async findVenueSeasonLeagueStats(venueSlug, season) {
      const knex = strapi.db.connection;
      return await knex("zadar_venue_league_season_record")
        .select("*")
        .where("venue_slug", venueSlug)
        .andWhere("season", season);
    },

    async findVenueLeagueStats(venueSlug) {
      const knex = strapi.db.connection;
      return await knex("zadar_venue_league_record as vlr")
        .join(
          knex("schedule")
            .select("league_slug", "league_name")
            .distinctOn("league_slug")
            .as("l"),
          "vlr.league_slug",
          "l.league_slug"
        )
        .select(
          "vlr.venue_slug",
          "vlr.league_id",
          "vlr.league_slug",
          "l.league_name",
          "vlr.games",
          "vlr.wins",
          "vlr.losses",
          "vlr.win_percentage",
          "vlr.avg_attendance"
        )
        .where("vlr.venue_slug", venueSlug)
        .orderBy("vlr.games", "desc");
    },
  }),
);
