/**
 * team service
 */

import { factories } from "@strapi/strapi";
import {
  validateWhitelist,
  validateSeason,
  ALLOWED_ENTITIES,
  ALLOWED_PLAYER_RECORD_STATS,
  ALLOWED_TEAM_RECORD_STATS,
} from "../../../validation";
import { getCached, TTL_24H, TTL_1H, CACHE_PREFIX } from "../../../utils/cache";
import { aggregateTeamStats, buildRecord } from "../../../lib/aggregation/queries";

// Shape a raw aggregateTeamStats row into the TeamStats JSONB-equivalent object
function toTeamStats(
  row: any | null,
  key: "Total" | "Home" | "Away" | "Neutral",
  leagueId?: any,
  leagueSlug?: any,
): Record<string, any> | null {
  if (!row) return null;
  return {
    key,
    games: row.games,
    wins: row.wins,
    losses: row.losses,
    win_percentage: row.win_pct,
    points_scored: row.points_scored,
    points_received: row.points_received,
    points_diff: row.points_diff,
    attendance: row.attendance,
    ...(leagueId !== undefined ? { league_id: leagueId, league_slug: leagueSlug } : {}),
  };
}

export default factories.createCoreService("api::team.team", ({ strapi }) => ({
  async getTeamSeasons(teamSlug) {
    return getCached(`${CACHE_PREFIX}team:seasons:${teamSlug}`, TTL_1H, () => {
      const knex = strapi.db.connection;
      return knex("schedule")
        .select("season")
        .distinct("season")
        .where("home_team_slug", teamSlug)
        .orWhere("away_team_slug", teamSlug);
    });
  },

  async findTeamCompetitions(teamSlug) {
    return getCached(`${CACHE_PREFIX}team:competitions:${teamSlug}`, TTL_1H, () => {
      const knex = strapi.db.connection;
      return knex("schedule")
        .select("league_id", "league_name", "league_slug", "league_short_name")
        .distinct("league_id")
        .where(function () {
          this.where("home_team_slug", teamSlug).orWhere(
            "away_team_slug",
            teamSlug,
          );
        });
    });
  },

  async findTeamSeasonCompetitions(teamName, season) {
    const validatedSeason = validateSeason(season);

    return getCached(
      `${CACHE_PREFIX}team:season-competitions:${teamName}:${validatedSeason}`,
      TTL_1H,
      () => {
        const knex = strapi.db.connection;
        return knex("schedule")
          .select("league_id", "league_name", "league_slug", "league_short_name")
          .distinct("league_id")
          .where("season", validatedSeason)
          .andWhere(function () {
            this.where("home_team_slug", teamName).orWhere(
              "away_team_slug",
              teamName,
            );
          });
      },
    );
  },

  async getTeamLeagueStats(teamSlug) {
    return getCached(`${CACHE_PREFIX}team:league-stats:${teamSlug}`, TTL_24H, async () => {
      const knex = strapi.db.connection;

      // Get all leagues this team played in
      const leagues: { league_id: string; league_slug: string }[] = await knex("schedule")
        .select("league_id", "league_slug")
        .distinct("league_id")
        .where(function () {
          this.where("home_team_slug", teamSlug).orWhere("away_team_slug", teamSlug);
        });

      if (leagues.length === 0) return null;

      // For each league, fetch all four location variants in parallel
      const leagueResults = await Promise.all(
        leagues.map(async ({ league_id, league_slug }) => {
          const [totalRow, homeRow, awayRow, neutralRow] = await Promise.all([
            aggregateTeamStats(knex, { location: "all",     teamSlug, league: league_slug }).then((r) => r[0] ?? null),
            aggregateTeamStats(knex, { location: "home",    teamSlug, league: league_slug }).then((r) => r[0] ?? null),
            aggregateTeamStats(knex, { location: "away",    teamSlug, league: league_slug }).then((r) => r[0] ?? null),
            aggregateTeamStats(knex, { location: "neutral", teamSlug, league: league_slug }).then((r) => r[0] ?? null),
          ]);

          if (!totalRow) return null;

          const total   = toTeamStats(totalRow,   "Total",   league_id, league_slug);
          const home    = toTeamStats(homeRow,    "Home",    league_id, league_slug);
          const away    = toTeamStats(awayRow,    "Away",    league_id, league_slug);
          const neutral = toTeamStats(neutralRow, "Neutral", league_id, league_slug);

          return {
            teamId:    totalRow.team_id,
            teamSlug:  totalRow.team_slug,
            teamName:  totalRow.team_name,
            leagueId:  league_id,
            leagueSlug: league_slug,
            total,
            home,
            away,
            neutral,
          };
        }),
      );

      return leagueResults.filter(Boolean);
    });
  },

  async findTeamDetails(teamSlug) {
    return getCached(`${CACHE_PREFIX}team:details:${teamSlug}`, TTL_1H, () => {
      const knex = strapi.db.connection;
      return knex("teams").select("*").where("slug", teamSlug);
    });
  },

  async findTeamAllTimeStats(teamSlug) {
    return getCached(`${CACHE_PREFIX}team:all-time-stats:${teamSlug}`, TTL_24H, async () => {
      const knex = strapi.db.connection;

      const record = await buildRecord(async (location) => {
        const rows = await aggregateTeamStats(knex, { location, teamSlug });
        return rows[0] ?? null;
      });

      const anyRow = record.total ?? record.home ?? record.away ?? record.neutral;
      if (!anyRow) return null;

      const total   = toTeamStats(record.total,   "Total");
      const home    = toTeamStats(record.home,    "Home");
      const away    = toTeamStats(record.away,    "Away");
      const neutral = toTeamStats(record.neutral, "Neutral");

      const stats = [home, away];
      if (neutral) stats.push(neutral);
      stats.push(total);

      return {
        teamId:   anyRow.team_id,
        teamSlug: anyRow.team_slug,
        teamName: anyRow.team_name,
        total,
        home,
        away,
        neutral,
        stats,
      };
    });
  },

  async findTeamSchedule(teamSlug, season) {
    const validatedSeason = validateSeason(season);

    return getCached(
      `${CACHE_PREFIX}team:schedule:${teamSlug}:${validatedSeason}`,
      TTL_1H,
      () => {
        const knex = strapi.db.connection;
        return knex("schedule")
          .select("*")
          .where(function () {
            this.where("home_team_slug", teamSlug).orWhere(
              "away_team_slug",
              teamSlug,
            );
          })
          .andWhere("season", validatedSeason);
      },
    );
  },

  async findTeamLeaders(
    teamSlug: string,
    db: "player" | "coach",
    statKey: string,
    competitionSlug?: string,
  ) {
    const validatedDb = validateWhitelist(db, ALLOWED_ENTITIES, "entity");

    const allowedStatKeys = [
      "points",
      "assists",
      "rebounds",
      "steals",
      "blocks",
      "three_pointers_made",
      "free_throws_made",
      "minutes",
      "games",
      "wins",
      "losses",
      "win_percentage",
      "points_scored",
      "points_received",
      "points_difference",
    ];
    if (statKey && !allowedStatKeys.includes(statKey)) {
      throw new Error(`Invalid statKey: "${statKey}"`);
    }

    return getCached(
      `${CACHE_PREFIX}team:leaders:${teamSlug}:${validatedDb}:${statKey}:${competitionSlug || "all"}`,
      TTL_24H,
      () => {
        const knex = strapi.db.connection;

        if (validatedDb === "player") {
          // Aggregate from player_boxscore directly, grouped by player + team
          return knex("player_boxscore as b")
            .select(
              knex.raw(`b.player_id as id`),
              "b.first_name",
              "b.last_name",
              knex.raw(`SUM(b.??) as ??`, [statKey, statKey]),
            )
            .where("b.team_slug", teamSlug)
            .where("b.is_nulled", false)
            .whereRaw(`b.status::text <> 'dnp-cd'::text`)
            .modify((qb) => {
              if (competitionSlug) {
                qb.where("b.league_slug", competitionSlug);
              }
            })
            .groupBy("b.player_id", "b.first_name", "b.last_name")
            .havingRaw(`SUM(b.??) IS NOT NULL`, [statKey])
            .orderByRaw(`SUM(b.??) DESC NULLS LAST`, [statKey])
            .limit(5);
        } else {
          // coach — aggregate from coach_boxscore
          const coachStatMap: Record<string, string> = {
            games: "COUNT(*)",
            wins: "SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END)",
            losses: "SUM(CASE WHEN cb.team_score < cb.opponent_score THEN 1 ELSE 0 END)",
            win_percentage: `ROUND(SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) * 100, 1)`,
            points_scored: "ROUND(AVG(cb.team_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1)",
            points_received: "ROUND(AVG(cb.opponent_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1)",
            points_difference: "ROUND(AVG(cb.team_score - cb.opponent_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1)",
          };

          const statExpr = coachStatMap[statKey];
          if (!statExpr) {
            throw new Error(`Invalid statKey for coach: "${statKey}"`);
          }

          return knex
            .raw(
              `SELECT
                cb.coach_id as id,
                cb.first_name,
                cb.last_name,
                ${statExpr} AS ??
              FROM coach_boxscore cb
              WHERE cb.team_slug = ?
                AND cb.is_nulled = false
                AND cb.coach_role = 'head'
                ${competitionSlug ? "AND cb.league_slug = ?" : ""}
              GROUP BY cb.coach_id, cb.first_name, cb.last_name
              HAVING (${statExpr}) IS NOT NULL
              ORDER BY (${statExpr}) DESC NULLS LAST
              LIMIT 5`,
              [statKey, teamSlug, ...(competitionSlug ? [competitionSlug] : [])],
            )
            .then((r) => r.rows);
        }
      },
    );
  },

  async findTeamSeasonStats(teamSlug, season) {
    return getCached(
      `${CACHE_PREFIX}team:season-stats:${teamSlug}:${season}`,
      TTL_24H,
      async () => {
        const knex = strapi.db.connection;

        const record = await buildRecord(async (location) => {
          const rows = await aggregateTeamStats(knex, { location, teamSlug, season });
          return rows[0] ?? null;
        });

        const anyRow = record.total ?? record.home ?? record.away ?? record.neutral;
        if (!anyRow) return null;

        const total   = toTeamStats(record.total,   "Total");
        const home    = toTeamStats(record.home,    "Home");
        const away    = toTeamStats(record.away,    "Away");
        const neutral = toTeamStats(record.neutral, "Neutral");

        const stats = [home, away];
        if (neutral) stats.push(neutral);
        stats.push(total);

        return {
          teamId:   anyRow.team_id,
          teamSlug: anyRow.team_slug,
          teamName: anyRow.team_name,
          total,
          home,
          away,
          neutral,
          stats,
        };
      },
    );
  },

  async findTeamSeasonLeagueStats(teamSlug, season) {
    return getCached(
      `${CACHE_PREFIX}team:season-league-stats:${teamSlug}:${season}`,
      TTL_24H,
      async () => {
        const knex = strapi.db.connection;

        // Get leagues this team played in during this season
        const leagues: { league_id: string; league_slug: string }[] = await knex("schedule")
          .select("league_id", "league_slug")
          .distinct("league_id")
          .where("season", season)
          .where(function () {
            this.where("home_team_slug", teamSlug).orWhere("away_team_slug", teamSlug);
          });

        if (leagues.length === 0) return null;

        const leagueResults = await Promise.all(
          leagues.map(async ({ league_id, league_slug }) => {
            const [totalRow, homeRow, awayRow, neutralRow] = await Promise.all([
              aggregateTeamStats(knex, { location: "all",     teamSlug, season, league: league_slug }).then((r) => r[0] ?? null),
              aggregateTeamStats(knex, { location: "home",    teamSlug, season, league: league_slug }).then((r) => r[0] ?? null),
              aggregateTeamStats(knex, { location: "away",    teamSlug, season, league: league_slug }).then((r) => r[0] ?? null),
              aggregateTeamStats(knex, { location: "neutral", teamSlug, season, league: league_slug }).then((r) => r[0] ?? null),
            ]);

            if (!totalRow) return null;

            const total   = toTeamStats(totalRow,   "Total",   league_id, league_slug);
            const home    = toTeamStats(homeRow,    "Home",    league_id, league_slug);
            const away    = toTeamStats(awayRow,    "Away",    league_id, league_slug);
            const neutral = toTeamStats(neutralRow, "Neutral", league_id, league_slug);

            return {
              teamId:    totalRow.team_id,
              teamSlug:  totalRow.team_slug,
              teamName:  totalRow.team_name,
              leagueId:  league_id,
              leagueSlug: league_slug,
              total,
              home,
              away,
              neutral,
            };
          }),
        );

        return leagueResults.filter(Boolean);
      },
    );
  },

  async findTeamPlayerRecords(
    teamSlug: string,
    statKey: string,
    season?: string,
  ) {
    validateWhitelist(statKey, ALLOWED_PLAYER_RECORD_STATS, "statKey");

    return getCached(
      `${CACHE_PREFIX}team:player-records:${teamSlug}:${statKey}:${season || "all"}`,
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
          .where("pb.team_slug", teamSlug)
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

  async findTeamTeamRecords(
    teamSlug: string,
    statKey: string,
    season?: string,
  ) {
    validateWhitelist(statKey, ALLOWED_TEAM_RECORD_STATS, "statKey");

    return getCached(
      `${CACHE_PREFIX}team:team-records:${teamSlug}:${statKey}:${season || "all"}`,
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
              [teamSlug],
            ),
            knex.raw(
              `CASE WHEN s.home_team_slug = ? THEN s.away_team_slug ELSE s.home_team_slug END AS opponent_slug`,
              [teamSlug],
            ),
            knex.raw(`tb.?? as stat_value`, [statKey]),
          )
          .where("tb.team_slug", teamSlug)
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
}));
