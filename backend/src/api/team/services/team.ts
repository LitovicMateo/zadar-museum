/**
 * team service
 */

import { factories } from "@strapi/strapi";
import {
  validateWhitelist,
  validateSeason,
  ALLOWED_DATABASES,
  ALLOWED_ENTITIES,
  ALLOWED_STATS,
  ALLOWED_LOCATIONS,
} from "../../../validation";

export default factories.createCoreService("api::team.team", ({ strapi }) => ({
  async getTeamSeasons(teamSlug) {
    const knex = strapi.db.connection;
    return knex("schedule")
      .select("season")
      .distinct("season")
      .where("home_team_slug", teamSlug)
      .orWhere("away_team_slug", teamSlug);
  },

  async findTeamCompetitions(teamSlug) {
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
  },

  async findTeamSeasonCompetitions(teamName, season) {
    // Validate season
    const validatedSeason = validateSeason(season);

    const knex = strapi.db.connection;

    // find unique competitions team played in during the season
    const data = await knex("schedule")
      .select("league_id", "league_name", "league_slug", "league_short_name")
      .distinct("league_id")
      .where("season", validatedSeason)
      .andWhere(function () {
        this.where("home_team_slug", teamName).orWhere(
          "away_team_slug",
          teamName,
        );
      });

    return data;
  },

  async getTeamLeagueStats(teamSlug) {
    const knex = strapi.db.connection;

    const data = await knex("team_league_average_stats_full")
      .select("*")
      .where("team_slug", teamSlug);

    if (data.length === 0) {
      return null;
    }

    const team = data.map((team) => {
      const total = JSON.parse(team.total);
      const home = JSON.parse(team.home);
      const away = JSON.parse(team.away);
      const neutral = team.neutral ? JSON.parse(team.neutral) : null;
      return {
        teamId: team.team_id,
        teamSlug: team.team_slug,
        teamName: team.team_name,
        leagueId: team.league_id,
        leagueSlug: team.league_slug,
        total,
        home,
        away,
        neutral,
      };
    });

    return team;
  },

  async findTeamDetails(teamSlug) {
    const knex = strapi.db.connection;
    const data = await knex("teams").select("*").where("slug", teamSlug);
    return data;
  },

  async findTeamAllTimeStats(teamSlug) {
    const knex = strapi.db.connection;
    const data = await knex("team_average_stats_full")
      .select("*")
      .where("team_slug", teamSlug);

    if (data.length === 0) {
      return null;
    }

    const team = data[0];

    const total = JSON.parse(team.total);
    const home = JSON.parse(team.home);
    const away = JSON.parse(team.away);
    const neutral = team.neutral ? JSON.parse(team.neutral) : null;

    const stats = [home, away];
    if (neutral) stats.push(neutral);
    stats.push(total);

    return {
      teamId: team.team_id,
      teamSlug: team.team_slug,
      teamName: team.team_name,
      total,
      home,
      away,
      neutral,
      stats,
    };
  },

  async findTeamSchedule(teamSlug, season) {
    // Validate season
    const validatedSeason = validateSeason(season);

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

  async findTeamLeaders(
    teamSlug: string,
    db: "player" | "coach",
    statKey: string,
    competitionSlug?: string,
  ) {
    // Validate db parameter
    const validatedDb = validateWhitelist(db, ALLOWED_ENTITIES, "entity");

    // Validate statKey to prevent SQL injection
    const allowedStatKeys = [
      // Player stats
      "points",
      "assists",
      "rebounds",
      "steals",
      "blocks",
      "three_pointers_made",
      "free_throws_made",
      "minutes",
      // Coach stats
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

    const knex = strapi.db.connection;
    let tableName: string;

    const table = competitionSlug
      ? `${validatedDb}_total_all_time_per_team_per_league`
      : `${validatedDb}_total_all_time_per_team`;

    const id = `${validatedDb}_id`;

    try {
      return knex(table)
        .select(`${id} as id`, "first_name", "last_name", statKey)
        .where("team_slug", teamSlug)
        .whereNotNull(statKey)
        .modify((qb) => {
          if (competitionSlug) {
            qb.where("league_slug", competitionSlug);
          }
        })
        .orderByRaw("?? desc nulls last", [statKey])
        .limit(5);
    } catch (err) {
      throw new Error(`Failed to fetch team leaders: ${err.message}`);
    }
  },

  async findTeamSeasonStats(teamSlug, season) {
    const knex = strapi.db.connection;
    const data = await knex("team_season_average_stats_full")
      .select("*")
      .where("team_slug", teamSlug)
      .andWhere("season", season);

    if (data.length === 0) {
      return null;
    }

    const team = data[0];

    const total = JSON.parse(team.total);
    const home = JSON.parse(team.home);
    const away = JSON.parse(team.away);
    const neutral = team.neutral ? JSON.parse(team.neutral) : null;

    const stats = [home, away];
    if (neutral) stats.push(neutral);
    stats.push(total);

    return {
      teamId: team.team_id,
      teamSlug: team.team_slug,
      teamName: team.team_name,
      total,
      home,
      away,
      neutral,
      stats,
    };
  },

  async findTeamSeasonLeagueStats(teamSlug, season) {
    const knex = strapi.db.connection;
    const data = await knex("team_season_league_average_stats_full")
      .select("*")
      .where("team_slug", teamSlug)
      .andWhere("season", season);

    if (data.length === 0) {
      return null;
    }

    const team = data.map((team) => {
      const total = JSON.parse(team.total);
      const home = JSON.parse(team.home);
      const away = JSON.parse(team.away);
      const neutral = team.neutral ? JSON.parse(team.neutral) : null;
      return {
        teamId: team.team_id,
        teamSlug: team.team_slug,
        teamName: team.team_name,
        leagueId: team.league_id,
        leagueSlug: team.league_slug,
        total,
        home,
        away,
        neutral,
      };
    });

    return team;
  },

  async findTeamPlayerRecords(
    teamSlug: string,
    statKey: string,
    season?: string,
  ) {
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
      .where("pb.team_slug", teamSlug)
      .whereNot("pb.is_nulled", true)
      .whereNotNull(`pb.${statKey}`)
      .modify((qb) => {
        if (season) qb.where("pb.season", season);
      })
      .orderByRaw(`pb.?? desc`, [statKey])
      .limit(20);
  },

  async findTeamTeamRecords(
    teamSlug: string,
    statKey: string,
    season?: string,
  ) {
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
}));
