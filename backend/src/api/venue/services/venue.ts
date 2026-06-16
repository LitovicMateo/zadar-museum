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
import { aggregateVenueRecord, buildRecord } from "../../../lib/aggregation/queries";
import { getMainTeamSlug } from "../../../lib/mainTeam";

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
        return buildRecord((location) =>
          aggregateVenueRecord(knex, { venueSlug, location }).then(
            (rows) => rows[0] ?? null,
          ),
        );
      });
    },

    async findVenuesTeamRecord() {
      return getCached("zadar:venue:all-team-records", TTL_24H, () => {
        const knex = strapi.db.connection;
        return aggregateVenueRecord(knex, { location: "all" });
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
          return buildRecord((location) =>
            aggregateVenueRecord(knex, { venueSlug, location, season }).then(
              (rows) => rows[0] ?? null,
            ),
          );
        },
      );
    },

    async findVenueSeasonLeagueStats(venueSlug, season) {
      return getCached(
        `zadar:venue:season-league-stats:${venueSlug}:${season}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          // Get distinct leagues played at this venue in the given season
          const leagues: { league_id: string; league_slug: string }[] =
            await knex("schedule")
              .select("league_id", "league_slug")
              .distinct("league_id")
              .where("venue_slug", venueSlug)
              .andWhere("season", season)
              .whereNotNull("league_id");

          if (leagues.length === 0) return null;

          const leagueResults = await Promise.all(
            leagues.map(async ({ league_id, league_slug }) => {
              const record = await buildRecord((location) =>
                aggregateVenueRecord(knex, {
                  venueSlug,
                  location,
                  season,
                  league: league_slug,
                }).then((rows) => rows[0] ?? null),
              );

              const anyRow =
                record.total ?? record.home ?? record.away ?? record.neutral;

              if (!anyRow) return null;

              return {
                venueSlug: anyRow.venue_slug,
                venueName: anyRow.venue_name,
                season,
                leagueId: league_id,
                leagueSlug: league_slug,
                total: record.total,
                home: record.home,
                away: record.away,
                neutral: record.neutral,
              };
            }),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },

    async findVenueLeagueStats(venueSlug) {
      return getCached(
        `zadar:venue:league-stats:${venueSlug}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          // Get distinct leagues played at this venue (all time)
          const leagues: { league_id: string; league_slug: string }[] =
            await knex("schedule")
              .select("league_id", "league_slug")
              .distinct("league_id")
              .where("venue_slug", venueSlug)
              .whereNotNull("league_id");

          if (leagues.length === 0) return null;

          const leagueResults = await Promise.all(
            leagues.map(async ({ league_id, league_slug }) => {
              const record = await buildRecord((location) =>
                aggregateVenueRecord(knex, {
                  venueSlug,
                  location,
                  league: league_slug,
                }).then((rows) => rows[0] ?? null),
              );

              const anyRow =
                record.total ?? record.home ?? record.away ?? record.neutral;

              if (!anyRow) return null;

              return {
                venueSlug: anyRow.venue_slug,
                venueName: anyRow.venue_name,
                leagueId: league_id,
                leagueSlug: league_slug,
                total: record.total,
                home: record.home,
                away: record.away,
                neutral: record.neutral,
              };
            }),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },

    async findVenuePlayerRecords(venueSlug, statKey, season?: string) {
      validateWhitelist(statKey, ALLOWED_PLAYER_RECORD_STATS, "statKey");

      return getCached(
        `zadar:venue:player-records:${venueSlug}:${statKey}:${season || "all"}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();
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
            .where("pb.team_slug", mainSlug)
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
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();
          return knex("team_boxscore as tb")
            .join("schedule as s", "tb.game_id", "s.game_document_id")
            .select(
              "tb.game_id",
              "tb.season",
              knex.raw(
                `CASE WHEN s.home_team_slug = ? THEN s.away_team_name ELSE s.home_team_name END AS opponent_name`,
                [mainSlug],
              ),
              knex.raw(
                `CASE WHEN s.home_team_slug = ? THEN s.away_team_slug ELSE s.home_team_slug END AS opponent_slug`,
                [mainSlug],
              ),
              knex.raw(`tb.?? as stat_value`, [statKey]),
            )
            .where("s.venue_slug", venueSlug)
            .where("tb.team_slug", mainSlug)
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
