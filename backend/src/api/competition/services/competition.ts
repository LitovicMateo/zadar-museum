/**
 * competition service
 */

import { factories } from "@strapi/strapi";
import { getCached, TTL_24H, TTL_1H } from "../../../utils/cache";
import { getMainTeamSlug } from "../../../lib/mainTeam";

export default factories.createCoreService(
  "api::competition.competition",
  ({ strapi }) => ({
    async findLeagueDetails(leagueSlug) {
      return getCached(`zadar:competition:details:${leagueSlug}`, TTL_1H, () =>
        strapi.db.query("api::competition.competition").findOne({
          where: { slug: leagueSlug },
          populate: ["image"],
        }),
      );
    },

    async findLeagueGames(leagueSlug, season) {
      return getCached(
        `zadar:competition:games:${leagueSlug}:${season}`,
        TTL_1H,
        () => {
          const knex = strapi.db.connection;
          return knex("schedule")
            .select("*")
            .where("league_slug", leagueSlug)
            .andWhere("season", season)
            .orderBy("game_date", "asc");
        },
      );
    },

    async findLeagueTeamRecord(leagueSlug) {
      return getCached(
        `zadar:competition:team-record:${leagueSlug}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();

          const sql = `
            WITH all_games AS (
              SELECT
                s.home_team_document_id AS team_id,
                s.home_team_slug AS team_slug,
                s.league_id,
                s.league_slug,
                CASE WHEN s.is_neutral THEN 'neutral' ELSE 'home' END AS venue,
                s.home_score AS points_scored,
                s.away_score AS points_allowed,
                s.attendance,
                s.forfeited,
                s.forfeited_by
              FROM schedule s
              WHERE s.home_score IS NOT NULL AND s.away_score IS NOT NULL
                AND s.is_nulled IS NOT TRUE AND s.league_slug = :league AND s.home_team_slug = :teamSlug

              UNION ALL

              SELECT
                s.away_team_document_id AS team_id,
                s.away_team_slug AS team_slug,
                s.league_id,
                s.league_slug,
                CASE WHEN s.is_neutral THEN 'neutral' ELSE 'away' END AS venue,
                s.away_score AS points_scored,
                s.home_score AS points_allowed,
                s.attendance,
                s.forfeited,
                s.forfeited_by
              FROM schedule s
              WHERE s.home_score IS NOT NULL AND s.away_score IS NOT NULL
                AND s.is_nulled IS NOT TRUE AND s.league_slug = :league AND s.away_team_slug = :teamSlug
            ),
            agg AS (
              SELECT
                team_id,
                team_slug,
                league_id,
                league_slug,
                venue,
                COUNT(*) AS games,
                SUM(CASE
                  WHEN forfeited AND forfeited_by = 'home' AND venue = 'away' THEN 1
                  WHEN forfeited AND forfeited_by = 'away' AND venue = 'home' THEN 1
                  WHEN NOT forfeited AND points_scored > points_allowed THEN 1
                  ELSE 0
                END) AS wins,
                SUM(CASE
                  WHEN forfeited AND forfeited_by = 'home' AND venue = 'home' THEN 1
                  WHEN forfeited AND forfeited_by = 'away' AND venue = 'away' THEN 1
                  WHEN NOT forfeited AND points_scored < points_allowed THEN 1
                  ELSE 0
                END) AS losses,
                ROUND(AVG(points_scored)  FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_scored,
                ROUND(AVG(points_allowed) FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_received,
                ROUND(AVG(points_scored - points_allowed) FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_diff,
                ROUND(AVG(NULLIF(attendance::text, '')::numeric), 0) AS attendance
              FROM all_games
              GROUP BY team_id, team_slug, league_id, league_slug, venue
            )
            SELECT
              team_id,
              team_slug,
              league_id,
              league_slug,
              venue,
              games,
              wins,
              losses,
              ROUND(100.0 * wins::numeric / NULLIF(games, 0), 1) AS win_percentage,
              points_scored,
              points_received,
              points_diff,
              attendance
            FROM agg
          `;

          const result = await knex.raw(sql, {
            league: leagueSlug,
            teamSlug: mainSlug,
          });
          const rows: any[] = result.rows;

          if (!rows.length) return null;

          const byVenue: Record<string, any> = {};
          for (const r of rows) {
            byVenue[r.venue] = r;
          }

          const firstRow = rows[0];
          const makeEntry = (key: string, r: any) => ({
            key,
            league_id: firstRow.league_id,
            league_slug: firstRow.league_slug,
            games: r?.games ?? 0,
            wins: r?.wins ?? 0,
            losses: r?.losses ?? 0,
            win_percentage: r?.win_percentage ?? 0,
            points_scored: r?.points_scored ?? 0,
            points_received: r?.points_received ?? 0,
            points_diff: r?.points_diff ?? 0,
            attendance: r?.attendance ?? 0,
          });

          // Compute total across all venues
          const allGames = rows.reduce((s, r) => s + Number(r.games), 0);
          const allWins = rows.reduce((s, r) => s + Number(r.wins), 0);
          const allLosses = rows.reduce((s, r) => s + Number(r.losses), 0);
          const totalEntry = {
            key: "Total",
            league_id: firstRow.league_id,
            league_slug: firstRow.league_slug,
            games: allGames,
            wins: allWins,
            losses: allLosses,
            win_percentage:
              allGames > 0
                ? Math.round((allWins / allGames) * 1000) / 10
                : 0,
            points_scored: null,
            points_received: null,
            points_diff: null,
            attendance: null,
          };

          return {
            teamId: firstRow.team_id,
            teamSlug: firstRow.team_slug,
            leagueId: firstRow.league_id,
            leagueSlug: firstRow.league_slug,
            stats: [
              makeEntry("Home", byVenue["home"]),
              makeEntry("Away", byVenue["away"]),
              totalEntry,
            ],
          };
        },
      );
    },

    async findLeagueSeasons(leagueSlug) {
      return getCached(
        `zadar:competition:seasons:${leagueSlug}`,
        TTL_1H,
        () => {
          const knex = strapi.db.connection;
          return knex("schedule")
            .select("season")
            .distinct("season")
            .where("league_slug", leagueSlug);
        },
      );
    },

    async findPlayerLeagueRankings(leagueSlug, stat) {
      return getCached(
        `zadar:competition:player-rankings:${leagueSlug}:${stat}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();

          const result = await knex.raw(
            `
            SELECT
              b.player_id,
              b.league_id,
              b.league_slug,
              b.first_name,
              b.last_name,
              COUNT(b.game_id) AS games,
              RANK() OVER (PARTITION BY b.league_id ORDER BY COUNT(b.game_id) DESC NULLS LAST) AS games_rank,
              SUM(CASE WHEN b.status::text = 'starter' THEN 1 ELSE 0 END) AS games_started,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(CASE WHEN b.status::text = 'starter' THEN 1 ELSE 0 END) DESC NULLS LAST) AS games_started_rank,
              SUM(b.minutes + (b.seconds / 60.0)) AS minutes,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.minutes + (b.seconds / 60.0)) DESC NULLS LAST) AS minutes_rank,
              SUM(b.points) AS points,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.points) DESC NULLS LAST) AS points_rank,
              SUM(b.assists) AS assists,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.assists) DESC NULLS LAST) AS assists_rank,
              SUM(b.offensive_rebounds) AS off_rebounds,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.offensive_rebounds) DESC NULLS LAST) AS off_rebounds_rank,
              SUM(b.defensive_rebounds) AS def_rebounds,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.defensive_rebounds) DESC NULLS LAST) AS def_rebounds_rank,
              SUM(b.rebounds) AS rebounds,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.rebounds) DESC NULLS LAST) AS rebounds_rank,
              SUM(b.steals) AS steals,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.steals) DESC NULLS LAST) AS steals_rank,
              SUM(b.blocks) AS blocks,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.blocks) DESC NULLS LAST) AS blocks_rank,
              SUM(b.field_goals_made) AS field_goals_made,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.field_goals_made) DESC NULLS LAST) AS field_goals_made_rank,
              SUM(b.field_goals_attempted) AS field_goals_attempted,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.field_goals_attempted) DESC NULLS LAST) AS field_goals_attempted_rank,
              CASE WHEN SUM(b.field_goals_attempted) = 0 THEN 0
                   ELSE ROUND(SUM(b.field_goals_made)::numeric / SUM(b.field_goals_attempted) * 100, 1)
              END AS field_goal_percentage,
              RANK() OVER (PARTITION BY b.league_id ORDER BY
                CASE WHEN SUM(b.field_goals_attempted) = 0 THEN 0
                     ELSE ROUND(SUM(b.field_goals_made)::numeric / SUM(b.field_goals_attempted) * 100, 1)
                END DESC NULLS LAST) AS field_goal_percentage_rank,
              SUM(b.three_pointers_made) AS three_pointers_made,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.three_pointers_made) DESC NULLS LAST) AS three_pointers_made_rank,
              SUM(b.three_pointers_attempted) AS three_pointers_attempted,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.three_pointers_attempted) DESC NULLS LAST) AS three_pointers_attempted_rank,
              CASE WHEN SUM(b.three_pointers_attempted) = 0 THEN 0
                   ELSE ROUND(SUM(b.three_pointers_made)::numeric / SUM(b.three_pointers_attempted) * 100, 1)
              END AS three_point_percentage,
              RANK() OVER (PARTITION BY b.league_id ORDER BY
                CASE WHEN SUM(b.three_pointers_attempted) = 0 THEN 0
                     ELSE ROUND(SUM(b.three_pointers_made)::numeric / SUM(b.three_pointers_attempted) * 100, 1)
                END DESC NULLS LAST) AS three_point_percentage_rank,
              SUM(b.free_throws_made) AS free_throws_made,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.free_throws_made) DESC NULLS LAST) AS free_throws_made_rank,
              SUM(b.free_throws_attempted) AS free_throws_attempted,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.free_throws_attempted) DESC NULLS LAST) AS free_throws_attempted_rank,
              CASE WHEN SUM(b.free_throws_attempted) = 0 THEN 0
                   ELSE ROUND(SUM(b.free_throws_made)::numeric / SUM(b.free_throws_attempted) * 100, 1)
              END AS free_throw_percentage,
              RANK() OVER (PARTITION BY b.league_id ORDER BY
                CASE WHEN SUM(b.free_throws_attempted) = 0 THEN 0
                     ELSE ROUND(SUM(b.free_throws_made)::numeric / SUM(b.free_throws_attempted) * 100, 1)
                END DESC NULLS LAST) AS free_throw_percentage_rank,
              SUM(b.efficiency) AS efficiency,
              RANK() OVER (PARTITION BY b.league_id ORDER BY SUM(b.efficiency) DESC NULLS LAST) AS efficiency_rank
            FROM player_boxscore b
            WHERE b.team_slug = :mainSlug
              AND b.status::text <> 'dnp-cd'
              AND b.is_nulled = false
              AND b.league_slug = :league
            GROUP BY b.player_id, b.first_name, b.last_name, b.league_id, b.league_slug
            ORDER BY SUM(b.points) DESC
            `,
            { mainSlug, league: leagueSlug },
          );
          return result.rows;
        },
      );
    },

    async findCoachLeagueRankings(leagueSlug, stat) {
      return getCached(
        `zadar:competition:coach-rankings:${leagueSlug}:${stat}`,
        TTL_24H,
        async () => {
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

          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();

          const result = await knex.raw(
            `
            SELECT
              cb.coach_id,
              cb.first_name,
              cb.last_name,
              COUNT(*) AS games,
              SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END) AS wins,
              SUM(CASE WHEN cb.team_score < cb.opponent_score THEN 1 ELSE 0 END) AS losses,
              ROUND(
                SUM(CASE WHEN cb.team_score > cb.opponent_score THEN 1 ELSE 0 END)::numeric
                / NULLIF(COUNT(*), 0) * 100, 1
              ) AS win_percentage,
              ROUND(AVG(cb.team_score)     FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_scored,
              ROUND(AVG(cb.opponent_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_received,
              ROUND(AVG(cb.team_score - cb.opponent_score) FILTER (WHERE cb.forfeited IS NOT TRUE), 1) AS points_difference
            FROM coach_boxscore cb
            WHERE cb.is_nulled = false
              AND cb.team_slug = :mainSlug
              AND cb.coach_role = 'head'
              AND cb.league_slug = :league
            GROUP BY cb.coach_id, cb.first_name, cb.last_name
            HAVING COUNT(*) > 0
            ORDER BY COUNT(*) DESC
            `,
            { mainSlug, league: leagueSlug },
          );
          return result.rows;
        },
      );
    },

    async findTeamSeasonLeagueStats(leagueSlug, season) {
      return getCached(
        `zadar:competition:team-season-stats:${leagueSlug}:${season}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();

          const sql = `
            WITH all_games AS (
              SELECT
                s.home_team_document_id AS team_id,
                s.home_team_slug AS team_slug,
                s.league_id,
                s.league_slug,
                s.season,
                CASE WHEN s.is_neutral THEN 'neutral' ELSE 'home' END AS venue,
                s.home_score AS points_scored,
                s.away_score AS points_allowed,
                s.attendance,
                s.forfeited,
                s.forfeited_by
              FROM schedule s
              WHERE s.home_score IS NOT NULL AND s.away_score IS NOT NULL
                AND s.is_nulled IS NOT TRUE AND s.league_slug = :league
                AND s.season = :season AND s.home_team_slug = :teamSlug

              UNION ALL

              SELECT
                s.away_team_document_id AS team_id,
                s.away_team_slug AS team_slug,
                s.league_id,
                s.league_slug,
                s.season,
                CASE WHEN s.is_neutral THEN 'neutral' ELSE 'away' END AS venue,
                s.away_score AS points_scored,
                s.home_score AS points_allowed,
                s.attendance,
                s.forfeited,
                s.forfeited_by
              FROM schedule s
              WHERE s.home_score IS NOT NULL AND s.away_score IS NOT NULL
                AND s.is_nulled IS NOT TRUE AND s.league_slug = :league
                AND s.season = :season AND s.away_team_slug = :teamSlug
            )
            SELECT
              team_id,
              team_slug,
              league_id,
              league_slug,
              season,
              venue,
              COUNT(*) AS games,
              SUM(CASE
                WHEN forfeited AND forfeited_by = 'home' AND venue = 'away' THEN 1
                WHEN forfeited AND forfeited_by = 'away' AND venue = 'home' THEN 1
                WHEN NOT forfeited AND points_scored > points_allowed THEN 1
                ELSE 0
              END) AS wins,
              SUM(CASE
                WHEN forfeited AND forfeited_by = 'home' AND venue = 'home' THEN 1
                WHEN forfeited AND forfeited_by = 'away' AND venue = 'away' THEN 1
                WHEN NOT forfeited AND points_scored < points_allowed THEN 1
                ELSE 0
              END) AS losses,
              ROUND(AVG(points_scored)  FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_scored,
              ROUND(AVG(points_allowed) FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_received,
              ROUND(AVG(points_scored - points_allowed) FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_diff,
              ROUND(AVG(NULLIF(attendance::text, '')::numeric), 0) AS attendance
            FROM all_games
            GROUP BY team_id, team_slug, league_id, league_slug, season, venue
          `;

          const result = await knex.raw(sql, {
            league: leagueSlug,
            season,
            teamSlug: mainSlug,
          });
          const rows: any[] = result.rows;
          if (!rows.length) return [];

          const firstRow = rows[0];
          const byVenue: Record<string, any> = {};
          for (const r of rows) {
            byVenue[r.venue] = r;
          }

          const makeEntry = (key: string, r: any) => ({
            key,
            league_id: firstRow.league_id,
            league_slug: firstRow.league_slug,
            games: r?.games ?? 0,
            wins: r?.wins ?? 0,
            losses: r?.losses ?? 0,
            win_percentage:
              r && Number(r.games) > 0
                ? Math.round((Number(r.wins) / Number(r.games)) * 1000) / 10
                : 0,
            points_scored: r?.points_scored ?? 0,
            points_received: r?.points_received ?? 0,
            points_diff: r?.points_diff ?? 0,
            attendance: r?.attendance ?? 0,
          });

          return [
            {
              teamId: firstRow.team_id,
              teamSlug: firstRow.team_slug,
              leagueId: firstRow.league_id,
              leagueSlug: firstRow.league_slug,
              season: firstRow.season,
              stats: {
                total: makeEntry("Total", {
                  league_id: firstRow.league_id,
                  league_slug: firstRow.league_slug,
                  games: rows.reduce((s, r) => s + Number(r.games), 0),
                  wins: rows.reduce((s, r) => s + Number(r.wins), 0),
                  losses: rows.reduce((s, r) => s + Number(r.losses), 0),
                }),
                home: makeEntry("Home", byVenue["home"]),
                away: makeEntry("Away", byVenue["away"]),
              },
            },
          ];
        },
      );
    },

    async findPlayerSeasonLeagueStats(leagueSlug, season) {
      return getCached(
        `zadar:competition:player-season-stats:${leagueSlug}:${season}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();

          const result = await knex.raw(
            `
            SELECT
              b.player_id,
              b.league_id,
              b.league_slug,
              b.first_name,
              b.last_name,
              b.season,
              COUNT(b.game_id) AS games,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY COUNT(b.game_id) DESC NULLS LAST) AS games_rank,
              SUM(CASE WHEN b.status::text = 'starter' THEN 1 ELSE 0 END) AS games_started,
              RANK() OVER (PARTITION BY b.season ORDER BY SUM(CASE WHEN b.status::text = 'starter' THEN 1 ELSE 0 END) DESC NULLS LAST) AS games_started_rank,
              ROUND(AVG(b.minutes + (b.seconds / 60.0)), 1) AS minutes,
              ROUND(AVG(b.points), 1) AS points,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.points) DESC NULLS LAST) AS points_rank,
              ROUND(AVG(b.assists), 1) AS assists,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY AVG(b.assists) DESC NULLS LAST) AS assists_rank,
              ROUND(AVG(b.offensive_rebounds), 1) AS off_rebounds,
              RANK() OVER (ORDER BY AVG(b.offensive_rebounds) DESC NULLS LAST) AS off_rebounds_rank,
              ROUND(AVG(b.defensive_rebounds), 1) AS def_rebounds,
              RANK() OVER (ORDER BY AVG(b.defensive_rebounds) DESC NULLS LAST) AS def_rebounds_rank,
              ROUND(AVG(b.rebounds), 1) AS rebounds,
              RANK() OVER (ORDER BY AVG(b.rebounds) DESC NULLS LAST) AS rebounds_rank,
              ROUND(AVG(b.steals), 1) AS steals,
              RANK() OVER (ORDER BY AVG(b.steals) DESC NULLS LAST) AS steals_rank,
              ROUND(AVG(b.blocks), 1) AS blocks,
              RANK() OVER (ORDER BY AVG(b.blocks) DESC NULLS LAST) AS blocks_rank,
              ROUND(AVG(b.field_goals_made), 1) AS field_goals_made,
              RANK() OVER (ORDER BY AVG(b.field_goals_made) DESC NULLS LAST) AS field_goals_made_rank,
              ROUND(AVG(b.field_goals_attempted), 1) AS field_goals_attempted,
              RANK() OVER (ORDER BY AVG(b.field_goals_attempted) DESC NULLS LAST) AS field_goals_attempted_rank,
              COALESCE(ROUND(AVG(
                CASE WHEN b.field_goals_attempted IS NULL OR b.field_goals_attempted = 0 THEN NULL
                     ELSE b.field_goals_made::numeric / b.field_goals_attempted END
              ) * 100, 1), 0) AS field_goal_percentage,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY
                COALESCE(ROUND(AVG(
                  CASE WHEN b.field_goals_attempted IS NULL OR b.field_goals_attempted = 0 THEN NULL
                       ELSE b.field_goals_made::numeric / b.field_goals_attempted END
                ) * 100, 1), 0) DESC NULLS LAST) AS field_goal_percentage_rank,
              ROUND(AVG(b.three_pointers_made), 1) AS three_pointers_made,
              RANK() OVER (ORDER BY AVG(b.three_pointers_made) DESC NULLS LAST) AS three_pointers_made_rank,
              ROUND(AVG(b.three_pointers_attempted), 1) AS three_pointers_attempted,
              RANK() OVER (ORDER BY AVG(b.three_pointers_attempted) DESC NULLS LAST) AS three_pointers_attempted_rank,
              COALESCE(ROUND(AVG(
                CASE WHEN b.three_pointers_attempted IS NULL OR b.three_pointers_attempted = 0 THEN NULL
                     ELSE b.three_pointers_made::numeric / b.three_pointers_attempted END
              ) * 100, 1), 0) AS three_point_percentage,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY
                COALESCE(ROUND(AVG(
                  CASE WHEN b.three_pointers_attempted IS NULL OR b.three_pointers_attempted = 0 THEN NULL
                       ELSE b.three_pointers_made::numeric / b.three_pointers_attempted END
                ) * 100, 1), 0) DESC NULLS LAST) AS three_point_percentage_rank,
              ROUND(AVG(b.free_throws_made), 1) AS free_throws_made,
              RANK() OVER (ORDER BY AVG(b.free_throws_made) DESC NULLS LAST) AS free_throws_made_rank,
              ROUND(AVG(b.free_throws_attempted), 1) AS free_throws_attempted,
              RANK() OVER (ORDER BY AVG(b.free_throws_attempted) DESC NULLS LAST) AS free_throws_attempted_rank,
              COALESCE(ROUND(AVG(
                CASE WHEN b.free_throws_attempted IS NULL OR b.free_throws_attempted = 0 THEN NULL
                     ELSE b.free_throws_made::numeric / b.free_throws_attempted END
              ) * 100, 1), 0) AS free_throw_percentage,
              RANK() OVER (PARTITION BY b.league_id, b.season ORDER BY
                COALESCE(ROUND(AVG(
                  CASE WHEN b.free_throws_attempted IS NULL OR b.free_throws_attempted = 0 THEN NULL
                       ELSE b.free_throws_made::numeric / b.free_throws_attempted END
                ) * 100, 1), 0) DESC NULLS LAST) AS free_throw_percentage_rank,
              ROUND(AVG(b.efficiency), 1) AS efficiency,
              RANK() OVER (ORDER BY AVG(b.efficiency) DESC NULLS LAST) AS efficiency_rank
            FROM player_boxscore b
            WHERE b.team_slug = :mainSlug
              AND b.status::text <> 'dnp-cd'
              AND b.is_nulled = false
              AND b.league_slug = :league
              AND b.season = :season
            GROUP BY b.player_id, b.first_name, b.last_name, b.league_id, b.league_slug, b.season
            ORDER BY COUNT(b.game_id) DESC
            `,
            { mainSlug, league: leagueSlug, season },
          );
          return result.rows;
        },
      );
    },
  }),
);
