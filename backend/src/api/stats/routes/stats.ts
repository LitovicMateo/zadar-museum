import { validate } from "../../../middlewares/validation";
import {
  playersAllTimeStatsQuerySchema,
  playersGameStatsQuerySchema,
  playersRecordsQuerySchema,
  teamsAllTimeStatsQuerySchema,
  teamsGameStatsQuerySchema,
  teamRecordsQuerySchema,
  coachesAllTimeStatsQuerySchema,
  refereesAllTimeStatsQuerySchema,
  playersCompareQuerySchema,
  coachesCompareQuerySchema,
} from "../../../validation/schemas/stats";

export default {
  routes: [
    {
      method: "GET",
      path: "/stats/player/all-time",
      handler: "stats.getPlayersAllTimeStats",
      config: {
        auth: false,
        middlewares: [validate({ query: playersAllTimeStatsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/player/game",
      handler: "stats.getPlayersGameStats",
      config: {
        auth: false,
        middlewares: [validate({ query: playersGameStatsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/player/records",
      handler: "stats.getPlayersRecords",
      config: {
        auth: false,
        middlewares: [validate({ query: playersRecordsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/team/all-time",
      handler: "stats.getTeamsAllTimeStats",
      config: {
        auth: false,
        middlewares: [validate({ query: teamsAllTimeStatsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/team/game",
      handler: "stats.getTeamsGameStats",
      config: {
        auth: false,
        middlewares: [validate({ query: teamsGameStatsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/team/records",
      handler: "stats.getTeamRecords",
      config: {
        auth: false,
        middlewares: [validate({ query: teamRecordsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/coach/all-time",
      handler: "stats.getCoachesAllTimeStats",
      config: {
        auth: false,
        middlewares: [validate({ query: coachesAllTimeStatsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/referee/all-time",
      handler: "stats.getRefereesAllTimeStats",
      config: {
        auth: false,
        middlewares: [validate({ query: refereesAllTimeStatsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/player/compare",
      handler: "stats.getPlayersCompareStats",
      config: {
        auth: false,
        middlewares: [validate({ query: playersCompareQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/player/roster",
      handler: "stats.getPlayersRoster",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/stats/coach/compare",
      handler: "stats.getCoachesCompareStats",
      config: {
        auth: false,
        middlewares: [validate({ query: coachesCompareQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/stats/coach/roster",
      handler: "stats.getCoachesRoster",
      config: {
        auth: false,
      },
    },
  ],
};
