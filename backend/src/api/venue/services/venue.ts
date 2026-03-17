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
          "l.league_slug",
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
          "vlr.avg_attendance",
        )
        .where("vlr.venue_slug", venueSlug)
        .orderBy("vlr.games", "desc");
    },

    async findVenuePlayerRecords(venueSlug, statKey, season?: string) {
      const ALLOWED = [
        "points",
        "rebounds",
        "assists",
        "steals",
        "blocks",
        "three_pointers_made",
        "free_throws_made",
        "field_goals_made",
        "plus_minus",
        "efficiency",
      ];
      if (!ALLOWED.includes(statKey)) throw new Error("Invalid stat key");

      const knex = strapi.db.connection;
      return await knex("player_boxscore as pb")
        .join("schedule as s", "pb.game_id", "s.game_document_id")
        .select(
          "pb.game_id",
          "pb.first_name",
          "pb.last_name",
          "pb.season",
          knex.raw(`pb.?? as stat_value`, [statKey]),
        )
        .where("s.venue_slug", venueSlug)
        .where("pb.team_slug", "kk-zadar")
        .whereNot("pb.is_nulled", true)
        .whereNotNull(`pb.${statKey}`)
        .modify((qb) => { if (season) qb.where("pb.season", season); })
        .orderByRaw(`pb.?? desc`, [statKey])
        .limit(20);
    },

    async findVenueTeamRecords(venueSlug, statKey, season?: string) {
      const ALLOWED = [
        "score",
        "field_goals_made",
        "three_pointers_made",
        "free_throws_made",
        "rebounds",
        "assists",
        "steals",
        "blocks",
      ];
      if (!ALLOWED.includes(statKey)) throw new Error("Invalid stat key");

      const knex = strapi.db.connection;
      return await knex("team_boxscore as tb")
        .join("schedule as s", "tb.game_id", "s.game_document_id")
        .select(
          "tb.game_id",
          "tb.season",
          knex.raw(
            `CASE WHEN s.home_team_slug = 'kk-zadar' THEN s.away_team_name ELSE s.home_team_name END AS opponent_name`,
          ),
          knex.raw(
            `CASE WHEN s.home_team_slug = 'kk-zadar' THEN s.away_team_slug ELSE s.home_team_slug END AS opponent_slug`,
          ),
          knex.raw(`tb.?? as stat_value`, [statKey]),
        )
        .where("s.venue_slug", venueSlug)
        .where("tb.team_slug", "kk-zadar")
        .whereNot("tb.is_nulled", true)
        .whereNotNull(`tb.${statKey}`)
        .modify((qb) => { if (season) qb.where("tb.season", season); })
        .orderByRaw(`tb.?? desc`, [statKey])
        .limit(20);
    },
  }),
);
