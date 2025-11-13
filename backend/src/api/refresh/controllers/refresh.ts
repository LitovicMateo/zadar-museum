import { Context } from "koa";
import refresh from "../routes/refresh";

export default {
  async refreshViews(ctx: Context) {
    const knex = strapi.db.connection;

    // List of materialized views you want to refresh
    const views = [
      // layer 1
      "player_boxscore",
      "team_boxscore",
      "coach_boxscore",
      "schedule",

      // layer 2

      // player records
      "zadar_player_record",
      "zadar_player_record_home",
      "zadar_player_record_away",
      "zadar_player_league_record",
      "zadar_player_league_record_home",
      "zadar_player_league_record_away",
      "zadar_player_season_record",
      "zadar_player_season_record_home",
      "zadar_player_season_record_away",
      "zadar_player_season_league_record",
      "zadar_player_season_league_record_home",
      "zadar_player_season_league_record_away",

      "opponent_player_record",
      "opponent_player_record_home",
      "opponent_player_record_away",
      "opponent_player_league_record",
      "opponent_player_league_record_home",
      "opponent_player_league_record_away",
      "opponent_player_season_record",
      "opponent_player_season_record_home",
      "opponent_player_season_record_away",
      "opponent_player_season_league_record",
      "opponent_player_season_league_record_home",
      "opponent_player_season_league_record_away",

      // team records
      "zadar_team_record",
      "zadar_team_record_home",
      "zadar_team_record_away",
      "zadar_team_league_record",
      "zadar_team_league_record_home",
      "zadar_team_league_record_away",
      "zadar_team_season_record",
      "zadar_team_season_record_home",
      "zadar_team_season_record_away",
      "zadar_team_season_league_record",
      "zadar_team_season_league_record_home",
      "zadar_team_season_league_record_away",

      "opponent_team_record",
      "opponent_team_record_home",
      "opponent_team_record_away",
      "opponent_team_league_record",
      "opponent_team_league_record_home",
      "opponent_team_league_record_away",
      "opponent_team_season_record",
      "opponent_team_season_record_home",
      "opponent_team_season_record_away",
      "opponent_team_season_league_record",
      "opponent_team_season_league_record_home",
      "opponent_team_season_league_record_away",

      // previous stats
      // opponent players
      "opponent_player_average_all_time_away_prev",
      "opponent_player_average_all_time_home_prev",
      "opponent_player_average_all_time_league_away_prev",
      "opponent_player_average_all_time_league_home_prev",
      "opponent_player_average_all_time_league_prev",
      "opponent_player_average_all_time_prev",

      "opponent_player_season_average_all_time_away_prev",
      "opponent_player_season_average_all_time_home_prev",
      "opponent_player_season_average_all_time_league_away_prev",
      "opponent_player_season_average_all_time_league_home_prev",
      "opponent_player_season_average_all_time_league_prev",
      "opponent_player_season_average_all_time_prev",

      "opponent_player_total_all_time_away_prev",
      "opponent_player_total_all_time_home_prev",
      "opponent_player_total_all_time_league_away_prev",
      "opponent_player_total_all_time_league_home_prev",
      "opponent_player_total_all_time_league_prev",
      "opponent_player_total_all_time_prev",

      "opponent_player_season_total_all_time_away_prev",
      "opponent_player_season_total_all_time_home_prev",
      "opponent_player_season_total_all_time_league_away_prev",
      "opponent_player_season_total_all_time_league_home_prev",
      "opponent_player_season_total_all_time_league_prev",
      "opponent_player_season_total_all_time_prev",

      // zadar players
      "zadar_player_average_all_time_away_prev",
      "zadar_player_average_all_time_home_prev",
      "zadar_player_average_all_time_league_away_prev",
      "zadar_player_average_all_time_league_home_prev",
      "zadar_player_average_all_time_league_prev",
      "zadar_player_average_all_time_prev",

      "zadar_player_season_average_all_time_away_prev",
      "zadar_player_season_average_all_time_home_prev",
      "zadar_player_season_average_all_time_league_away_prev",
      "zadar_player_season_average_all_time_league_home_prev",
      "zadar_player_season_average_all_time_league_prev",
      "zadar_player_season_average_all_time_prev",

      "zadar_player_total_all_time_away_prev",
      "zadar_player_total_all_time_home_prev",
      "zadar_player_total_all_time_league_away_prev",
      "zadar_player_total_all_time_league_home_prev",
      "zadar_player_total_all_time_league_prev",
      "zadar_player_total_all_time_prev",

      "zadar_player_season_total_all_time_away_prev",
      "zadar_player_season_total_all_time_home_prev",
      "zadar_player_season_total_all_time_league_away_prev",
      "zadar_player_season_total_all_time_league_home_prev",
      "zadar_player_season_total_all_time_league_prev",
      "zadar_player_season_total_all_time_prev",

      // opponent coach
      "opponent_assistant_coach_league_record_away_prev",
      "opponent_assistant_coach_league_record_home_prev",
      "opponent_assistant_coach_league_record_prev",
      "opponent_assistant_coach_record_away_prev",
      "opponent_assistant_coach_record_home_prev",
      "opponent_assistant_coach_record_prev",

      "opponent_assistant_coach_season_league_record_away_prev",
      "opponent_assistant_coach_season_league_record_home_prev",
      "opponent_assistant_coach_season_league_record_prev",
      "opponent_assistant_coach_season_record_away_prev",
      "opponent_assistant_coach_season_record_home_prev",
      "opponent_assistant_coach_season_record_prev",

      "opponent_head_coach_league_record_away_prev",
      "opponent_head_coach_league_record_home_prev",
      "opponent_head_coach_league_record_prev",
      "opponent_head_coach_record_away_prev",
      "opponent_head_coach_record_home_prev",
      "opponent_head_coach_record_prev",

      "opponent_head_coach_season_league_record_away_prev",
      "opponent_head_coach_season_league_record_home_prev",
      "opponent_head_coach_season_league_record_prev",
      "opponent_head_coach_season_record_away_prev",
      "opponent_head_coach_season_record_home_prev",
      "opponent_head_coach_season_record_prev",

      "opponent_coach_league_record_away_prev",
      "opponent_coach_league_record_home_prev",
      "opponent_coach_league_record_prev",
      "opponent_coach_record_away_prev",
      "opponent_coach_record_home_prev",
      "opponent_coach_record_prev",

      "opponent_coach_season_league_record_away_prev",
      "opponent_coach_season_league_record_home_prev",
      "opponent_coach_season_league_record_prev",
      "opponent_coach_season_record_away_prev",
      "opponent_coach_season_record_home_prev",
      "opponent_coach_season_record_prev",

      // zadar coach
      "zadar_assistant_coach_league_record_away_prev",
      "zadar_assistant_coach_league_record_home_prev",
      "zadar_assistant_coach_league_record_prev",
      "zadar_assistant_coach_record_away_prev",
      "zadar_assistant_coach_record_home_prev",
      "zadar_assistant_coach_record_prev",

      "zadar_assistant_coach_season_league_record_away_prev",
      "zadar_assistant_coach_season_league_record_home_prev",
      "zadar_assistant_coach_season_league_record_prev",
      "zadar_assistant_coach_season_record_away_prev",
      "zadar_assistant_coach_season_record_home_prev",
      "zadar_assistant_coach_season_record_prev",

      "zadar_head_coach_league_record_away_prev",
      "zadar_head_coach_league_record_home_prev",
      "zadar_head_coach_league_record_prev",
      "zadar_head_coach_record_away_prev",
      "zadar_head_coach_record_home_prev",
      "zadar_head_coach_record_prev",

      "zadar_head_coach_season_league_record_away_prev",
      "zadar_head_coach_season_league_record_home_prev",
      "zadar_head_coach_season_league_record_prev",
      "zadar_head_coach_season_record_away_prev",
      "zadar_head_coach_season_record_home_prev",
      "zadar_head_coach_season_record_prev",

      "zadar_coach_league_record_away_prev",
      "zadar_coach_league_record_home_prev",
      "zadar_coach_league_record_prev",
      "zadar_coach_record_away_prev",
      "zadar_coach_record_home_prev",
      "zadar_coach_record_prev",

      "zadar_coach_season_league_record_away_prev",
      "zadar_coach_season_league_record_home_prev",
      "zadar_coach_season_league_record_prev",
      "zadar_coach_season_record_away_prev",
      "zadar_coach_season_record_home_prev",
      "zadar_coach_season_record_prev",

      // players
      // opponent players
      "opponent_player_average_all_time_away",
      "opponent_player_average_all_time_home",
      "opponent_player_average_all_time_league_away",
      "opponent_player_average_all_time_league_home",
      "opponent_player_average_all_time_league",
      "opponent_player_average_all_time",

      "opponent_player_season_average_all_time_away",
      "opponent_player_season_average_all_time_home",
      "opponent_player_season_average_all_time_league_away",
      "opponent_player_season_average_all_time_league_home",
      "opponent_player_season_average_all_time_league",
      "opponent_player_season_average_all_time",

      "opponent_player_total_all_time_away",
      "opponent_player_total_all_time_home",
      "opponent_player_total_all_time_league_away",
      "opponent_player_total_all_time_league_home",
      "opponent_player_total_all_time_league",
      "opponent_player_total_all_time",

      "opponent_player_season_total_all_time_away",
      "opponent_player_season_total_all_time_home",
      "opponent_player_season_total_all_time_league_away",
      "opponent_player_season_total_all_time_league_home",
      "opponent_player_season_total_all_time_league",
      "opponent_player_season_total_all_time",

      // zadar players
      "zadar_player_average_all_time_away",
      "zadar_player_average_all_time_home",
      "zadar_player_average_all_time_league_away",
      "zadar_player_average_all_time_league_home",
      "zadar_player_average_all_time_league",
      "zadar_player_average_all_time",

      "zadar_player_season_average_all_time_away",
      "zadar_player_season_average_all_time_home",
      "zadar_player_season_average_all_time_league_away",
      "zadar_player_season_average_all_time_league_home",
      "zadar_player_season_average_all_time_league",
      "zadar_player_season_average_all_time",

      "zadar_player_total_all_time_away",
      "zadar_player_total_all_time_home",
      "zadar_player_total_all_time_league_away",
      "zadar_player_total_all_time_league_home",
      "zadar_player_total_all_time_league",
      "zadar_player_total_all_time",

      "zadar_player_season_total_all_time_away",
      "zadar_player_season_total_all_time_home",
      "zadar_player_season_total_all_time_league_away",
      "zadar_player_season_total_all_time_league_home",
      "zadar_player_season_total_all_time_league",
      "zadar_player_season_total_all_time",

      // career high
      "zadar_player_career_high",
      "zadar_player_career_high_aggregate",
      "opponent_player_career_high",
      "opponent_player_career_high_aggregate",

      // per team
      "opponent_player_average_all_time_per_team_away",
      "opponent_player_average_all_time_per_team_home",
      "opponent_player_average_all_time_per_team_per_league_away",
      "opponent_player_average_all_time_per_team_per_league_home",
      "opponent_player_average_all_time_per_team_per_league",
      "opponent_player_average_all_time_per_team",

      "opponent_player_season_average_all_time_per_team_away",
      "opponent_player_season_average_all_time_per_team_home",
      "opponent_player_season_average_all_time_per_team_per_league_away",
      "opponent_player_season_average_all_time_per_team_per_league_home",
      "opponent_player_season_average_all_time_per_team_per_league",
      "opponent_player_season_average_all_time_per_team",

      "player_total_all_time_per_team_away",
      "player_total_all_time_per_team_home",
      "player_total_all_time_per_team_per_league_away",
      "player_total_all_time_per_team_per_league_home",
      "player_total_all_time_per_team_per_league",
      "player_total_all_time_per_team",

      "opponent_player_season_total_all_time_per_team_away",
      "opponent_player_season_total_all_time_per_team_home",
      "opponent_player_season_total_all_time_per_team_per_league_away",
      "opponent_player_season_total_all_time_per_team_per_league_home",
      "opponent_player_season_total_all_time_per_team_per_league",
      "opponent_player_season_total_all_time_per_team",

      // referee
      "referee_league_stats_away",
      "referee_league_stats_home",
      "referee_league_stats",
      "referee_stats_away",
      "referee_stats_home",
      "referee_stats",

      "referee_season_league_stats_away",
      "referee_season_league_stats_home",
      "referee_season_league_stats",
      "referee_season_stats_away",
      "referee_season_stats_home",
      "referee_season_stats",

      // team
      "team_average_stats_away",
      "team_average_stats_home",
      "team_average_stats",
      "team_league_average_stats_away",
      "team_league_average_stats_home",
      "team_league_average_stats",

      "team_season_average_stats_away",
      "team_season_average_stats_home",
      "team_season_average_stats",
      "team_season_league_average_stats_away",
      "team_season_league_average_stats_home",
      "team_season_league_average_stats",

      // opponent coach
      "opponent_assistant_coach_league_record_away",
      "opponent_assistant_coach_league_record_home",
      "opponent_assistant_coach_league_record",
      "opponent_assistant_coach_record_away",
      "opponent_assistant_coach_record_home",
      "opponent_assistant_coach_record",

      "opponent_assistant_coach_season_league_record_away",
      "opponent_assistant_coach_season_league_record_home",
      "opponent_assistant_coach_season_league_record",
      "opponent_assistant_coach_season_record_away",
      "opponent_assistant_coach_season_record_home",
      "opponent_assistant_coach_season_record",

      "opponent_head_coach_league_record_away",
      "opponent_head_coach_league_record_home",
      "opponent_head_coach_league_record",
      "opponent_head_coach_record_away",
      "opponent_head_coach_record_home",
      "opponent_head_coach_record",

      "opponent_head_coach_season_league_record_away",
      "opponent_head_coach_season_league_record_home",
      "opponent_head_coach_season_league_record",
      "opponent_head_coach_season_record_away",
      "opponent_head_coach_season_record_home",
      "opponent_head_coach_season_record",

      "opponent_coach_league_record_away",
      "opponent_coach_league_record_home",
      "opponent_coach_league_record",
      "opponent_coach_record_away",
      "opponent_coach_record_home",
      "opponent_coach_record",

      "opponent_coach_season_league_record_away",
      "opponent_coach_season_league_record_home",
      "opponent_coach_season_league_record",
      "opponent_coach_season_record_away",
      "opponent_coach_season_record_home",
      "opponent_coach_season_record",

      // zadar coach
      "zadar_assistant_coach_league_record_away",
      "zadar_assistant_coach_league_record_home",
      "zadar_assistant_coach_league_record",
      "zadar_assistant_coach_record_away",
      "zadar_assistant_coach_record_home",
      "zadar_assistant_coach_record",

      "zadar_assistant_coach_season_league_record_away",
      "zadar_assistant_coach_season_league_record_home",
      "zadar_assistant_coach_season_league_record",
      "zadar_assistant_coach_season_record_away",
      "zadar_assistant_coach_season_record_home",
      "zadar_assistant_coach_season_record",

      "zadar_head_coach_league_record_away",
      "zadar_head_coach_league_record_home",
      "zadar_head_coach_league_record",
      "zadar_head_coach_record_away",
      "zadar_head_coach_record_home",
      "zadar_head_coach_record",

      "zadar_head_coach_season_league_record_away",
      "zadar_head_coach_season_league_record_home",
      "zadar_head_coach_season_league_record",
      "zadar_head_coach_season_record_away",
      "zadar_head_coach_season_record_home",
      "zadar_head_coach_season_record",

      "zadar_coach_league_record_away",
      "zadar_coach_league_record_home",
      "zadar_coach_league_record",
      "zadar_coach_record_away",
      "zadar_coach_record_home",
      "zadar_coach_record",

      "zadar_coach_season_league_record_away",
      "zadar_coach_season_league_record_home",
      "zadar_coach_season_league_record",
      "zadar_coach_season_record_away",
      "zadar_coach_season_record_home",
      "zadar_coach_season_record",

      // coach per team
      "coach_total_all_time_per_team_per_league",
      "coach_total_all_time_per_team",
      "opponent_head_coach_league_record_away_per_team",
      "opponent_head_coach_league_record_home_per_team",
      "opponent_head_coach_record_away_per_team",
      "opponent_head_coach_record_home_per_team",

      "opponent_head_coach_season_league_record_away_per_team",
      "opponent_head_coach_season_league_record_home_per_team",
      "opponent_head_coach_season_league_record_per_team",
      "opponent_head_coach_season_record_away_per_team",
      "opponent_head_coach_season_record_home_per_team",
      "opponent_head_coach_season_record_per_team",

      // venue
      "zadar_venue_league_record",
      "zadar_venue_league_season_record",
      "zadar_venue_record",
      "zadar_venue_season_record",

      // LAYER 3
      // coach
      "opponent_coach_league_record_full",
      "opponent_coach_record_full",
      "opponent_coach_season_league_record_full",
      "opponent_coach_season_record_full",

      "zadar_coach_league_record_full",
      "zadar_coach_record_full",
      "zadar_coach_season_league_record_full",
      "zadar_coach_season_record_full",

      // league
      "team_all_time_league_record_full",
      "team_all_time_league_season_record_full",

      // player
      "zadar_player_record_full",
      "zadar_player_league_record_full",
      "opponent_player_record_full",
      "opponent_player_league_record_full",

      // referee
      "referee_all_time_record",
      "referee_season_league_record_full",

      // team
      "team_average_stats_full",
      "team_league_average_stats_full",
      "team_season_average_stats_full",
      "team_season_league_average_stats_full",
    ];

    try {
      for (const view of views) {
        await knex.raw(`REFRESH MATERIALIZED VIEW "${view}";`);
      }

      ctx.body = { success: true, message: "Materialized views refreshed." };
    } catch (err: any) {
      strapi.log.error("Failed to refresh views", err); // log full error to console
      ctx.throw(500, `Failed to refresh views: ${err.message}`);
    }
  },

  async refreshSchedule(ctx) {
    const knex = strapi.db.connection;
    await knex.raw(`REFRESH MATERIALIZED VIEW "schedule";`);
    ctx.body = { success: true, message: "Schedule refreshed." };
  },
};
