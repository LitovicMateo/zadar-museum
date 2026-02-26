import { validate } from "../../../middlewares/validation";
import {
  coachIdParamsSchema,
  coachSeasonsParamsSchema,
  coachSeasonCompetitionsParamsSchema,
  coachDbParamsSchema,
  coachCareerTotalsParamsSchema,
  coachLeagueTotalsParamsSchema,
  coachSeasonTotalsParamsSchema,
} from "../../../validation/schemas/coach";

export default {
  routes: [
    {
      method: "GET",
      path: "/coach/:coachId",
      handler: "coach.getCoachDetails",
      config: {
        auth: false,
        middlewares: [validate({ params: coachIdParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/coach/seasons/:coachId",
      handler: "coach.getCoachSeasons",
      config: {
        auth: false,
        middlewares: [validate({ params: coachIdParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/coach/competitions/:season/:coachId",
      handler: "coach.getCoachSeasonCompetitions",
      config: {
        auth: false,
        middlewares: [
          validate({ params: coachSeasonCompetitionsParamsSchema }),
        ],
      },
    },
    {
      method: "GET",
      path: "/coach/gamelog/:coachId/:db",
      handler: "coach.getCoachGamelog",
      config: {
        auth: false,
        middlewares: [validate({ params: coachDbParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/coach/team-record/:coachId/:db",
      handler: "coach.getCoachTeamRecord",
      config: {
        auth: false,
        middlewares: [validate({ params: coachDbParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/coach/league-stats/:coachId/:db",
      handler: "coach.getCoachLeagueRecord",
      config: {
        auth: false,
        middlewares: [validate({ params: coachDbParamsSchema })],
      },
    },

    {
      method: "GET",
      path: "/coach/teams/:coachId",
      handler: "coach.getCoachTeams",
      config: {
        auth: false,
        middlewares: [validate({ params: coachIdParamsSchema })],
      },
    },

    {
      method: "GET",
      path: "/coach/stats/league/:coachId/:season/:db",
      handler: "coach.getCoachLeagueSeasonStats",
      config: {
        auth: false,
        middlewares: [validate({ params: coachLeagueTotalsParamsSchema })],
      },
    },

    {
      method: "GET",
      path: "/coach/stats/total/:coachId/:season/:db",
      handler: "coach.getCoachTotalSeasonStats",
      config: {
        auth: false,
        middlewares: [validate({ params: coachSeasonTotalsParamsSchema })],
      },
    },
  ],
};
