/**
 * venue service
 */

import { factories } from "@strapi/strapi";
import {
  ALLOWED_PLAYER_RECORD_STATS,
  ALLOWED_TEAM_RECORD_STATS,
  validateWhitelist,
} from "../../../validation/whitelists";
import { getCached, TTL_24H, TTL_1H, CACHE_PREFIX } from "../../../utils/cache";
import { aggregateVenueRecord, type Phase } from "../../../lib/aggregation/queries";
import { getMainTeamSlug } from "../../../lib/mainTeam";
import type { Knex } from "knex";

// Flatten an aggregateVenueRecord row into the venue league-stats shape.
function flatVenue(row: any | null) {
  if (!row) return null;
  return {
    games: row.games,
    wins: row.wins,
    losses: row.losses,
    win_percentage: row.win_percentage,
    avg_attendance: row.avg_attendance,
  };
}

// Runs the three phases for one venue + league and returns the combined row plus
// the regular/playoff split rows and the hasPhaseSplit flag.
async function venueLeaguePhaseSet(
  knex: Knex,
  args: { venueSlug: string; league_slug: string; season?: string },
) {
  const run = (phase: Phase) =>
    aggregateVenueRecord(knex, {
      venueSlug: args.venueSlug,
      location: "all",
      league: args.league_slug,
      season: args.season,
      phase,
    }).then((r) => r[0] ?? null);

  const [all, regular, playoff] = await Promise.all([run("all"), run("regular"), run("playoff")]);
  if (!all) return null;
  const regularGames = Number(regular?.games ?? 0);
  const playoffGames = Number(playoff?.games ?? 0);
  return {
    all,
    regular: flatVenue(regular),
    playoff: flatVenue(playoff),
    hasPhaseSplit: regularGames > 0 && playoffGames > 0,
  };
}

export default factories.createCoreService(
  "api::venue.venue",
  ({ strapi }) => ({
    async findVenueDetails(venueSlug) {
      return getCached(`${CACHE_PREFIX}venue:details:${venueSlug}`, TTL_1H, () =>
        strapi.db
          .query("api::venue.venue")
          .findOne({ where: { slug: venueSlug }, populate: ["image"] }),
      );
    },

    async findVenueGamelog(venueSlug, season) {
      return getCached(
        `${CACHE_PREFIX}venue:gamelog:${venueSlug}:${season}`,
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
      return getCached(`${CACHE_PREFIX}venue:team-record:${venueSlug}`, TTL_24H, () => {
        const knex = strapi.db.connection;
        return aggregateVenueRecord(knex, { venueSlug, location: "all" });
      });
    },

    async findVenuesTeamRecord(location: "home" | "away") {
      return getCached(`${CACHE_PREFIX}venue:all-team-records:${location}`, TTL_24H, () => {
        const knex = strapi.db.connection;
        return aggregateVenueRecord(knex, { location });
      });
    },

    async findVenueSeasons(venueSlug) {
      return getCached(`${CACHE_PREFIX}venue:seasons:${venueSlug}`, TTL_1H, () => {
        const knex = strapi.db.connection;
        return knex("schedule")
          .select("season")
          .distinct("season")
          .where("venue_slug", venueSlug);
      });
    },

    async findVenueSeasonCompetitions(venueSlug, season) {
      return getCached(
        `${CACHE_PREFIX}venue:season-competitions:${venueSlug}:${season}`,
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
        `${CACHE_PREFIX}venue:season-stats:${venueSlug}:${season}`,
        TTL_24H,
        () => {
          const knex = strapi.db.connection;
          return aggregateVenueRecord(knex, { venueSlug, season, location: "all" });
        },
      );
    },

    async findVenueSeasonLeagueStats(venueSlug, season) {
      return getCached(
        `${CACHE_PREFIX}venue:season-league-stats:${venueSlug}:${season}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          // Get distinct leagues played at this venue in the given season
          const leagues: { league_id: string; league_slug: string; league_name: string }[] =
            await knex("schedule")
              .select("league_id", "league_slug", "league_name")
              .distinct("league_id")
              .where("venue_slug", venueSlug)
              .andWhere("season", season)
              .whereNotNull("league_id");

          if (leagues.length === 0) return null;

          // league_id can map to more than one league_name historically (renames);
          // dedupe to one row per league_id before aggregating.
          const uniqueLeagues = Array.from(
            new Map(leagues.map((l) => [l.league_id, l])).values(),
          );

          const leagueResults = await Promise.all(
            uniqueLeagues.map(async ({ league_id, league_slug, league_name }) => {
              const set = await venueLeaguePhaseSet(knex, { venueSlug, league_slug, season });
              if (!set) return null;
              const row = set.all;

              return {
                venue_slug: row.venue_slug,
                venue_name: row.venue_name,
                season,
                league_id,
                league_slug,
                league_name,
                games: row.games,
                wins: row.wins,
                losses: row.losses,
                win_percentage: row.win_percentage,
                avg_attendance: row.avg_attendance,
                regular: set.regular,
                playoff: set.playoff,
                hasPhaseSplit: set.hasPhaseSplit,
              };
            }),
          );

          return leagueResults.filter(Boolean);
        },
      );
    },

    async findVenueLeagueStats(venueSlug) {
      return getCached(
        `${CACHE_PREFIX}venue:league-stats:${venueSlug}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;

          // Get distinct leagues played at this venue (all time)
          const leagues: { league_id: string; league_slug: string; league_name: string }[] =
            await knex("schedule")
              .select("league_id", "league_slug", "league_name")
              .distinct("league_id")
              .where("venue_slug", venueSlug)
              .whereNotNull("league_id");

          if (leagues.length === 0) return null;

          // league_id can map to more than one league_name historically (renames);
          // dedupe to one row per league_id before aggregating.
          const uniqueLeagues = Array.from(
            new Map(leagues.map((l) => [l.league_id, l])).values(),
          );

          const leagueResults = await Promise.all(
            uniqueLeagues.map(async ({ league_id, league_slug, league_name }) => {
              const set = await venueLeaguePhaseSet(knex, { venueSlug, league_slug });
              if (!set) return null;
              const row = set.all;

              return {
                venue_slug: row.venue_slug,
                venue_name: row.venue_name,
                league_id,
                league_slug,
                league_name,
                games: row.games,
                wins: row.wins,
                losses: row.losses,
                win_percentage: row.win_percentage,
                avg_attendance: row.avg_attendance,
                regular: set.regular,
                playoff: set.playoff,
                hasPhaseSplit: set.hasPhaseSplit,
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
        `${CACHE_PREFIX}venue:player-records:${venueSlug}:${statKey}:${season || "all"}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();
          return knex("player_boxscore as pb")
            .join("schedule as s", "pb.game_id", "s.game_document_id")
            .leftJoin("players as p", "p.document_id", "pb.player_id")
            .leftJoin("files_related_mph as m", function () {
              this.on("m.related_id", "=", "p.id")
                .andOnVal("m.related_type", "=", "api::player.player")
                .andOnVal("m.field", "=", "image");
            })
            .leftJoin("files as f", "f.id", "m.file_id")
            .select(
              "pb.game_id",
              "pb.first_name",
              "pb.last_name",
              "pb.season",
              "f.url as image_url",
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

    async findVenueSeasonPlayerRecords(venueSlug: string, season: string) {
      return getCached(
        `${CACHE_PREFIX}venue:season-player-records:${venueSlug}:${season}`,
        TTL_24H,
        async () => {
          const service = strapi.service("api::venue.venue");
          const entries = await Promise.all(
            ALLOWED_PLAYER_RECORD_STATS.map(async (statKey) => {
              const rows = await service.findVenuePlayerRecords(
                venueSlug,
                statKey,
                season,
              );
              return [statKey, rows.slice(0, 5)] as const;
            }),
          );
          return Object.fromEntries(entries);
        },
      );
    },

    async findVenueTeamRecords(venueSlug, statKey, season?: string) {
      validateWhitelist(statKey, ALLOWED_TEAM_RECORD_STATS, "statKey");

      return getCached(
        `${CACHE_PREFIX}venue:team-records:${venueSlug}:${statKey}:${season || "all"}`,
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
