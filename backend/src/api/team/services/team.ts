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
import {
  aggregateTeamStats,
  aggregatePlayerStats,
  buildRecord,
  type Phase,
} from "../../../lib/aggregation/queries";
import { getMainTeamSlug } from "../../../lib/mainTeam";
import type { Knex } from "knex";

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

// Computes the four location variants for one league + phase. Returns the
// nested { total, home, away, neutral } record plus the raw total row (for
// team identity and game-count thresholds), or null when the team has no games.
async function teamLeaguePhase(
  knex: Knex,
  args: {
    teamSlug: string;
    league_id: any;
    league_slug: string;
    season?: string;
    phase: Phase;
  },
): Promise<{ record: Record<string, any>; totalRow: any } | null> {
  const { teamSlug, league_id, league_slug, season, phase } = args;
  const base = { teamSlug, league: league_slug, season, phase };
  const [totalRow, homeRow, awayRow, neutralRow] = await Promise.all([
    aggregateTeamStats(knex, { ...base, location: "all" }).then((r) => r[0] ?? null),
    aggregateTeamStats(knex, { ...base, location: "home" }).then((r) => r[0] ?? null),
    aggregateTeamStats(knex, { ...base, location: "away" }).then((r) => r[0] ?? null),
    aggregateTeamStats(knex, { ...base, location: "neutral" }).then((r) => r[0] ?? null),
  ]);
  if (!totalRow) return null;
  return {
    totalRow,
    record: {
      total: toTeamStats(totalRow, "Total", league_id, league_slug),
      home: toTeamStats(homeRow, "Home", league_id, league_slug),
      away: toTeamStats(awayRow, "Away", league_id, league_slug),
      neutral: toTeamStats(neutralRow, "Neutral", league_id, league_slug),
    },
  };
}

// Assembles one per-league result with regular/playoff split + hasPhaseSplit.
async function teamLeagueResultWithSplit(
  knex: Knex,
  args: { teamSlug: string; league_id: any; league_slug: string; season?: string },
): Promise<Record<string, any> | null> {
  const [all, regular, playoff] = await Promise.all([
    teamLeaguePhase(knex, { ...args, phase: "all" }),
    teamLeaguePhase(knex, { ...args, phase: "regular" }),
    teamLeaguePhase(knex, { ...args, phase: "playoff" }),
  ]);
  if (!all) return null;
  const regularGames = Number(regular?.record.total?.games ?? 0);
  const playoffGames = Number(playoff?.record.total?.games ?? 0);
  return {
    teamId: all.totalRow.team_id,
    teamSlug: all.totalRow.team_slug,
    teamName: all.totalRow.team_name,
    leagueId: args.league_id,
    leagueSlug: args.league_slug,
    ...all.record,
    regular: regular?.record ?? null,
    playoff: playoff?.record ?? null,
    hasPhaseSplit: regularGames > 0 && playoffGames > 0,
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

      // For each league, fetch all location variants per phase in parallel.
      const leagueResults = await Promise.all(
        leagues.map(({ league_id, league_slug }) =>
          teamLeagueResultWithSplit(knex, { teamSlug, league_id, league_slug }),
        ),
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

      const stats: Record<string, any>[] = [];
      if (home) stats.push(home);
      if (away) stats.push(away);
      if (neutral) stats.push(neutral);
      if (total) stats.push(total);

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
            .leftJoin("players as p", "p.document_id", "b.player_id")
            .leftJoin("files_related_mph as m", function () {
              this.on("m.related_id", "=", "p.id")
                .andOnVal("m.related_type", "=", "api::player.player")
                .andOnVal("m.field", "=", "image");
            })
            .leftJoin("files as f", "f.id", "m.file_id")
            .select(
              knex.raw(`b.player_id as id`),
              "b.first_name",
              "b.last_name",
              knex.raw(`MAX(f.url) as image_url`),
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
                MAX(f.url) AS image_url,
                ${statExpr} AS ??
              FROM coach_boxscore cb
              LEFT JOIN coaches c ON c.document_id = cb.coach_id
              LEFT JOIN files_related_mph m ON m.related_id = c.id AND m.related_type = 'api::coach.coach' AND m.field = 'image'
              LEFT JOIN files f ON f.id = m.file_id
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

        const stats: Record<string, any>[] = [];
        if (home) stats.push(home);
        if (away) stats.push(away);
        if (neutral) stats.push(neutral);
        if (total) stats.push(total);

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
          leagues.map(({ league_id, league_slug }) =>
            teamLeagueResultWithSplit(knex, { teamSlug, league_id, league_slug, season }),
          ),
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
          .leftJoin("players as p", "p.document_id", "pb.player_id")
          .leftJoin("files_related_mph as m", function () {
            this.on("m.related_id", "=", "p.id")
              .andOnVal("m.related_type", "=", "api::player.player")
              .andOnVal("m.field", "=", "image");
          })
          .leftJoin("files as f", "f.id", "m.file_id")
          .select(
            "pb.game_id",
            "pb.player_id",
            "pb.first_name",
            "pb.last_name",
            "pb.season",
            "f.url as image_url",
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

  // Aggregate player roster (total or average) for the League/Season tab player
  // section. `database: 'team'` scopes to this team's own players; `'main'`
  // scopes to the main team's players in the games they played against this
  // team (head-to-head). Returns the { total, home, away, neutral } location
  // split so the frontend can toggle location client-side.
  async findTeamPlayerSplitStats(
    teamSlug: string,
    opts: {
      season?: string;
      league?: string;
      stats: "total" | "average";
      database: "team" | "main";
    },
  ) {
    const { season, league, stats, database } = opts;
    return getCached(
      `${CACHE_PREFIX}team:player-split-stats:${teamSlug}:${database}:${stats}:${league || "all"}:${season || "all"}`,
      TTL_24H,
      async () => {
        const knex = strapi.db.connection;
        const scope =
          database === "main"
            ? { teamSlug: await getMainTeamSlug(), opponentSlug: teamSlug }
            : { teamSlug };
        return buildRecord((location) =>
          aggregatePlayerStats(knex, { stats, location, league, season, ...scope }),
        );
      },
    );
  },

  // Per-game player records (single-game highs) for the same player section,
  // for one stat category. Same team/main scoping as findTeamPlayerSplitStats.
  async findTeamPlayerSplitRecords(
    teamSlug: string,
    statKey: string,
    opts: { season?: string; league?: string; database: "team" | "main" },
  ) {
    validateWhitelist(statKey, ALLOWED_PLAYER_RECORD_STATS, "statKey");
    const { season, league, database } = opts;
    return getCached(
      `${CACHE_PREFIX}team:player-split-records:${teamSlug}:${database}:${statKey}:${league || "all"}:${season || "all"}`,
      TTL_24H,
      async () => {
        const knex = strapi.db.connection;
        const mainSlug = database === "main" ? await getMainTeamSlug() : null;

        const runForLocation = (location: "all" | "home" | "away" | "neutral") =>
          knex("player_boxscore as pb")
            .leftJoin("players as p", "p.document_id", "pb.player_id")
            .leftJoin("files_related_mph as m", function () {
              this.on("m.related_id", "=", "p.id")
                .andOnVal("m.related_type", "=", "api::player.player")
                .andOnVal("m.field", "=", "image");
            })
            .leftJoin("files as f", "f.id", "m.file_id")
            .select(
              "pb.game_id",
              "pb.player_id",
              "pb.first_name",
              "pb.last_name",
              "pb.season",
              "f.url as image_url",
              knex.raw(`pb.?? as stat_value`, [statKey]),
            )
            .whereNot("pb.is_nulled", true)
            .whereNotNull(`pb.${statKey}`)
            .modify((qb) => {
              if (database === "main") {
                qb.where("pb.team_slug", mainSlug!).where(
                  "pb.opponent_team_slug",
                  teamSlug,
                );
              } else {
                qb.where("pb.team_slug", teamSlug);
              }
              if (league && league !== "all") qb.where("pb.league_slug", league);
              if (season && season !== "all") qb.where("pb.season", season);
              if (location !== "all") qb.where("pb.is_home_team", location);
            })
            .orderByRaw(`pb.?? desc`, [statKey])
            .limit(20);

        return buildRecord(async (location) => await runForLocation(location));
      },
    );
  },
}));
