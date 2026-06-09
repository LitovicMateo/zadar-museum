/**
 * venue service
 */

import { factories } from "@strapi/strapi";
import {
  ALLOWED_PLAYER_RECORD_STATS,
  ALLOWED_TEAM_RECORD_STATS,
  validateWhitelist,
} from "../../../validation/whitelists";
import { getCached, TTL_24H, TTL_1H } from "../../../utils/cache";

const KK_ZADAR_SLUG = "kk-zadar";

export default factories.createCoreService(
  "api::venue.venue",
  ({ strapi }) => ({
    async findVenueDetails(venueSlug) {
      return getCached(`zadar:venue:details:${venueSlug}`, TTL_1H, () =>
        strapi.db
          .query("api::venue.venue")
          .findOne({ where: { slug: venueSlug }, populate: ["image"] }),
      );
    },

    async findVenueGamelog(venueSlug, season) {
      return getCached(
        `zadar:venue:gamelog:${venueSlug}:${season}`,
        TTL_1H,
        () => {
          const knex = strapi.db.connection;
          return knex("schedule")
            .select("*")
            .where("venue_slug", venueSlug)
            .andWhere("season", season)
            .orderBy("game_date", "asc");
        },
      );
    },

    async findVenueTeamRecord(venueSlug) {
      return getCached(`zadar:venue:team-record:${venueSlug}`, TTL_24H, () => {
        const knex = strapi.db.connection;
        return knex("zadar_venue_record")
          .select("*")
          .where("venue_slug", venueSlug);
      });
    },

    async findVenuesTeamRecord() {
      return getCached("zadar:venue:all-team-records", TTL_24H, () => {
        const knex = strapi.db.connection;
        return knex("zadar_venue_record").select("*");
      });
    },

    async findVenueSeasons(venueSlug) {
      return getCached(`zadar:venue:seasons:${venueSlug}`, TTL_1H, () => {
        const knex = strapi.db.connection;
        return knex("schedule")
          .select("season")
          .distinct("season")
          .where("venue_slug", venueSlug);
      });
    },

    async findVenueSeasonCompetitions(venueSlug, season) {
      return getCached(
        `zadar:venue:season-competitions:${venueSlug}:${season}`,
        TTL_1H,
        () => {
          const knex = strapi.db.connection;
          return knex("schedule")
            .select(
              "league_slug",
              "league_name",
              "league_id",
              "league_short_name",
            )
            .distinct("league_slug")
            .where("venue_slug", venueSlug)
            .andWhere("season", season);
        },
      );
    },

    async findVenueSeasonStats(venueSlug, season) {
      return getCached(
        `zadar:venue:season-stats:${venueSlug}:${season}`,
        TTL_24H,
        () => {
          const knex = strapi.db.connection;
          return knex("zadar_venue_season_record")
            .select("*")
            .where("venue_slug", venueSlug)
            .andWhere("season", season);
        },
      );
    },

    async findVenueSeasonLeagueStats(venueSlug, season) {
      return getCached(
        `zadar:venue:season-league-stats:${venueSlug}:${season}`,
        TTL_24H,
        () => {
          const knex = strapi.db.connection;
          return knex("zadar_venue_league_season_record")
            .select("*")
            .where("venue_slug", venueSlug)
            .andWhere("season", season);
        },
      );
    },

    async findVenueLeagueStats(venueSlug) {
      return getCached(`zadar:venue:league-stats:${venueSlug}`, TTL_24H, () => {
        const knex = strapi.db.connection;
        return knex("zadar_venue_league_record as vlr")
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
      });
    },

    async findVenuePlayerRecords(venueSlug, statKey, season?: string) {
      validateWhitelist(statKey, ALLOWED_PLAYER_RECORD_STATS, "statKey");

      return getCached(
        `zadar:venue:player-records:${venueSlug}:${statKey}:${season || "all"}`,
        TTL_24H,
        () => {
          const knex = strapi.db.connection;
          return knex("player_boxscore as pb")
            .join("schedule as s", "pb.game_id", "s.game_document_id")
            .select(
              "pb.game_id",
              "pb.first_name",
              "pb.last_name",
              "pb.season",
              knex.raw(`pb.?? as stat_value`, [statKey]),
            )
            .where("s.venue_slug", venueSlug)
            .where("pb.team_slug", KK_ZADAR_SLUG)
            .whereNot("pb.is_nulled", true)
            .whereNotNull(`pb.${statKey}`)
            .modify((qb) => {
              if (season) qb.where("pb.season", season);
            })
            .orderByRaw(`pb.?? desc`, [statKey])
            .limit(20);
        },
      );
    },

    async findVenueTeamRecords(venueSlug, statKey, season?: string) {
      validateWhitelist(statKey, ALLOWED_TEAM_RECORD_STATS, "statKey");

      return getCached(
        `zadar:venue:team-records:${venueSlug}:${statKey}:${season || "all"}`,
        TTL_24H,
        () => {
          const knex = strapi.db.connection;
          return knex("team_boxscore as tb")
            .join("schedule as s", "tb.game_id", "s.game_document_id")
            .select(
              "tb.game_id",
              "tb.season",
              knex.raw(
                `CASE WHEN s.home_team_slug = ? THEN s.away_team_name ELSE s.home_team_name END AS opponent_name`,
                [KK_ZADAR_SLUG],
              ),
              knex.raw(
                `CASE WHEN s.home_team_slug = ? THEN s.away_team_slug ELSE s.home_team_slug END AS opponent_slug`,
                [KK_ZADAR_SLUG],
              ),
              knex.raw(`tb.?? as stat_value`, [statKey]),
            )
            .where("s.venue_slug", venueSlug)
            .where("tb.team_slug", KK_ZADAR_SLUG)
            .whereNot("tb.is_nulled", true)
            .whereNotNull(`tb.${statKey}`)
            .modify((qb) => {
              if (season) qb.where("tb.season", season);
            })
            .orderByRaw(`tb.?? desc`, [statKey])
            .limit(20);
        },
      );
    },
  }),
);
