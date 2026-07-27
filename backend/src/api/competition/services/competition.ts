/**
 * competition service
 */

import { factories } from "@strapi/strapi";
import { getCached, TTL_24H, TTL_1H, CACHE_PREFIX } from "../../../utils/cache";
import { getMainTeamSlug } from "../../../lib/mainTeam";
import { phaseClause, type Phase } from "../../../lib/aggregation/queries";

export default factories.createCoreService(
  "api::competition.competition",
  ({ strapi }) => ({
    async findLeagueDetails(leagueSlug) {
      return getCached(`${CACHE_PREFIX}competition:details:${leagueSlug}`, TTL_1H, () =>
        strapi.db.query("api::competition.competition").findOne({
          where: { slug: leagueSlug },
          populate: ["image"],
        }),
      );
    },

    async findLeagueGames(leagueSlug, season) {
      return getCached(
        `${CACHE_PREFIX}competition:games:${leagueSlug}:${season}`,
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
        `${CACHE_PREFIX}competition:team-record:${leagueSlug}`,
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
                COALESCE(venue, 'total') AS venue,
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
              GROUP BY GROUPING SETS (
                (team_id, team_slug, league_id, league_slug, venue),
                (team_id, team_slug, league_id, league_slug)
              )
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

          return {
            teamId: firstRow.team_id,
            teamSlug: firstRow.team_slug,
            leagueId: firstRow.league_id,
            leagueSlug: firstRow.league_slug,
            stats: [
              makeEntry("Home", byVenue["home"]),
              makeEntry("Away", byVenue["away"]),
              makeEntry("Total", byVenue["total"]),
            ],
          };
        },
      );
    },

    async findLeagueSeasons(leagueSlug) {
      return getCached(
        `${CACHE_PREFIX}competition:seasons:${leagueSlug}`,
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
        `${CACHE_PREFIX}competition:player-rankings:${leagueSlug}:${stat}`,
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
        `${CACHE_PREFIX}competition:coach-rankings:${leagueSlug}:${stat}`,
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
        `${CACHE_PREFIX}competition:team-season-stats:${leagueSlug}:${season}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();

          const buildSql = (phaseSql: string | null) => `
            WITH all_games AS (
              SELECT
                s.home_team_document_id AS team_id,
                s.home_team_slug AS team_slug,
                s.league_id,
                s.league_slug,
                s.season,
                CASE WHEN s.is_neutral THEN 'neutral' ELSE 'home' END AS venue,
                'home' AS side,
                s.home_score AS points_scored,
                s.away_score AS points_allowed,
                s.attendance,
                s.forfeited,
                s.forfeited_by
              FROM schedule s
              WHERE s.home_score IS NOT NULL AND s.away_score IS NOT NULL
                AND s.is_nulled IS NOT TRUE AND s.league_slug = :league
                AND s.season = :season AND s.home_team_slug = :teamSlug
                ${phaseSql ? `AND ${phaseSql}` : ""}

              UNION ALL

              SELECT
                s.away_team_document_id AS team_id,
                s.away_team_slug AS team_slug,
                s.league_id,
                s.league_slug,
                s.season,
                CASE WHEN s.is_neutral THEN 'neutral' ELSE 'away' END AS venue,
                'away' AS side,
                s.away_score AS points_scored,
                s.home_score AS points_allowed,
                s.attendance,
                s.forfeited,
                s.forfeited_by
              FROM schedule s
              WHERE s.home_score IS NOT NULL AND s.away_score IS NOT NULL
                AND s.is_nulled IS NOT TRUE AND s.league_slug = :league
                AND s.season = :season AND s.away_team_slug = :teamSlug
                ${phaseSql ? `AND ${phaseSql}` : ""}
            )
            SELECT
              team_id,
              team_slug,
              league_id,
              league_slug,
              season,
              COALESCE(venue, 'total') AS venue,
              COUNT(*) AS games,
              SUM(CASE
                WHEN forfeited AND forfeited_by <> 'none' AND forfeited_by <> side THEN 1
                WHEN NOT forfeited AND points_scored > points_allowed THEN 1
                ELSE 0
              END) AS wins,
              SUM(CASE
                WHEN forfeited AND forfeited_by = side THEN 1
                WHEN NOT forfeited AND points_scored < points_allowed THEN 1
                ELSE 0
              END) AS losses,
              ROUND(AVG(points_scored)  FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_scored,
              ROUND(AVG(points_allowed) FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_received,
              ROUND(AVG(points_scored - points_allowed) FILTER (WHERE forfeited IS NOT TRUE), 1) AS points_diff,
              ROUND(AVG(NULLIF(attendance::text, '')::numeric), 0) AS attendance
            FROM all_games
            GROUP BY GROUPING SETS (
              (team_id, team_slug, league_id, league_slug, season, venue),
              (team_id, team_slug, league_id, league_slug, season)
            )
          `;

          const sqlBindings = { league: leagueSlug, season, teamSlug: mainSlug };

          // Builds the { total, home, away } stats record for one phase, or null
          // when the main team has no games in that phase for the season.
          const computePhase = async (phase: Phase) => {
            const phaseSql = phaseClause("s.stage", phase);
            const result = await knex.raw(buildSql(phaseSql), sqlBindings);
            const rows: any[] = result.rows;
            if (!rows.length) return null;

            const firstRow = rows[0];
            const byVenue: Record<string, any> = {};
            for (const r of rows) byVenue[r.venue] = r;

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

            const totalRow = byVenue["total"];
            return {
              firstRow,
              totalGames: Number(totalRow?.games ?? 0),
              stats: {
                total: makeEntry("Total", totalRow),
                home: makeEntry("Home", byVenue["home"]),
                away: makeEntry("Away", byVenue["away"]),
                neutral: makeEntry("Neutral", byVenue["neutral"]),
              },
            };
          };

          const [all, regular, playoff] = await Promise.all([
            computePhase("all"),
            computePhase("regular"),
            computePhase("playoff"),
          ]);
          if (!all) return [];

          return [
            {
              teamId: all.firstRow.team_id,
              teamSlug: all.firstRow.team_slug,
              leagueId: all.firstRow.league_id,
              leagueSlug: all.firstRow.league_slug,
              season: all.firstRow.season,
              stats: all.stats,
              regular: regular?.stats ?? null,
              playoff: playoff?.stats ?? null,
              hasPhaseSplit: (regular?.totalGames ?? 0) > 0 && (playoff?.totalGames ?? 0) > 0,
            },
          ];
        },
      );
    },

    async findPlayerSeasonLeagueStats(leagueSlug, season) {
      return getCached(
        `${CACHE_PREFIX}competition:player-season-stats:${leagueSlug}:${season}`,
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

    async findSeasonPlayerLeaders(leagueSlug, season) {
      return getCached(
        `${CACHE_PREFIX}competition:season-leaders:${leagueSlug}:${season}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();

          // Per-player season totals AND averages for the main team, joined to
          // players/files for the profile picture. The frontend sorts by the
          // chosen category + mode and slices the top 5.
          return knex("player_boxscore as b")
            .leftJoin("players as p", "p.document_id", "b.player_id")
            .leftJoin("files_related_mph as m", function () {
              this.on("m.related_id", "=", "p.id")
                .andOnVal("m.related_type", "=", "api::player.player")
                .andOnVal("m.field", "=", "image");
            })
            .leftJoin("files as f", "f.id", "m.file_id")
            .select(
              knex.raw(`b.player_id as player_id`),
              "b.first_name",
              "b.last_name",
              knex.raw(`MAX(f.url) as image_url`),
              knex.raw(`COUNT(b.game_id) as games`),
              knex.raw(`SUM(b.minutes + (b.seconds / 60.0)) as minutes_total`),
              knex.raw(`ROUND(AVG(b.minutes + (b.seconds / 60.0)), 1) as minutes_avg`),
              knex.raw(`SUM(b.points) as points_total`),
              knex.raw(`ROUND(AVG(b.points), 1) as points_avg`),
              knex.raw(`SUM(b.rebounds) as rebounds_total`),
              knex.raw(`ROUND(AVG(b.rebounds), 1) as rebounds_avg`),
              knex.raw(`SUM(b.assists) as assists_total`),
              knex.raw(`ROUND(AVG(b.assists), 1) as assists_avg`),
              knex.raw(`SUM(b.three_pointers_made) as three_pointers_made_total`),
              knex.raw(`ROUND(AVG(b.three_pointers_made), 1) as three_pointers_made_avg`),
            )
            .where("b.team_slug", mainSlug)
            .where("b.league_slug", leagueSlug)
            .where("b.season", season)
            .where("b.is_nulled", false)
            .whereRaw(`b.status::text <> 'dnp-cd'::text`)
            .groupBy("b.player_id", "b.first_name", "b.last_name")
            .orderByRaw(`COUNT(b.game_id) DESC`);
        },
      );
    },

    async findSeasonTeamRecords(leagueSlug, season) {
      return getCached(
        `${CACHE_PREFIX}competition:season-team-records:${leagueSlug}:${season}`,
        TTL_24H,
        async () => {
          const knex = strapi.db.connection;
          const mainSlug = await getMainTeamSlug();

          // One row per main-team game in this competition/season, carrying the
          // main team's points scored/allowed, attendance, win margin, and 3PM.
          const result = await knex.raw(
            `
            WITH main_games AS (
              SELECT
                s.game_document_id AS game_id,
                s.season,
                s.away_team_name AS opponent_name,
                s.away_team_slug AS opponent_slug,
                s.home_score AS points_scored,
                s.away_score AS points_allowed,
                NULLIF(s.attendance, '')::numeric AS attendance
              FROM schedule s
              WHERE s.is_nulled IS NOT TRUE
                AND s.home_score IS NOT NULL AND s.away_score IS NOT NULL
                AND s.league_slug = :league AND s.season = :season
                AND s.home_team_slug = :mainSlug

              UNION ALL

              SELECT
                s.game_document_id AS game_id,
                s.season,
                s.home_team_name AS opponent_name,
                s.home_team_slug AS opponent_slug,
                s.away_score AS points_scored,
                s.home_score AS points_allowed,
                NULLIF(s.attendance, '')::numeric AS attendance
              FROM schedule s
              WHERE s.is_nulled IS NOT TRUE
                AND s.home_score IS NOT NULL AND s.away_score IS NOT NULL
                AND s.league_slug = :league AND s.season = :season
                AND s.away_team_slug = :mainSlug
            )
            SELECT
              mg.game_id,
              mg.season,
              mg.opponent_name,
              mg.opponent_slug,
              mg.points_scored,
              mg.points_allowed,
              mg.attendance,
              (mg.points_scored - mg.points_allowed) AS score_diff,
              tb.three_pointers_made
            FROM main_games mg
            LEFT JOIN team_boxscore tb
              ON tb.game_id = mg.game_id
              AND tb.team_slug = :mainSlug
              AND tb.is_nulled IS NOT TRUE
            `,
            { mainSlug, league: leagueSlug, season },
          );

          const rows: any[] = result.rows;

          const toItem = (r: any, statField: string) => ({
            game_id: r.game_id,
            opponent_name: r.opponent_name,
            opponent_slug: r.opponent_slug,
            season: r.season,
            stat_value: Number(r[statField]),
          });

          const topBy = (
            field: string,
            dir: "desc" | "asc",
            filterFn?: (r: any) => boolean,
          ) =>
            rows
              .filter((r) => r[field] != null && (filterFn ? filterFn(r) : true))
              .sort((a, b) =>
                dir === "desc" ? b[field] - a[field] : a[field] - b[field],
              )
              .slice(0, 5)
              .map((r) => toItem(r, field));

          return {
            most_points: topBy("points_scored", "desc"),
            least_points_allowed: topBy("points_allowed", "asc"),
            most_threes: topBy("three_pointers_made", "desc"),
            largest_win: topBy("score_diff", "desc", (r) => r.score_diff > 0),
            highest_attendance: topBy("attendance", "desc"),
          };
        },
      );
    },
  }),
);
