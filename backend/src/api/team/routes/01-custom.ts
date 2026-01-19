import { validate } from "../../../middlewares/validation";
import {
  teamSlugParamsSchema,
  teamSeasonsParamsSchema,
  teamSeasonCompetitionsQuerySchema,
  teamGamesParamsSchema,
  teamLeadersQuerySchema,
  teamAverageParamsSchema,
  teamRecordParamsSchema,
} from "../../../validation/schemas/team";

export default {
  routes: [
    {
      method: "GET",
      path: "/team/details/:teamSlug",
      handler: "team.getTeamDetails",
      config: {
        auth: false,
        middlewares: [validate({ params: teamSlugParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/team/stats/total/:teamSlug",
      handler: "team.getTeamAllTimeStats",
      config: {
        auth: false,
        middlewares: [validate({ params: teamSlugParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/team/seasons/:teamSlug",
      handler: "team.getTeamSeasons",
      config: {
        auth: false,
        middlewares: [validate({ params: teamSlugParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/team/competitions/:teamSlug",
      handler: "team.getTeamCompetitions",
      config: {
        auth: false,
        middlewares: [validate({ params: teamSlugParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/team/competitions",
      handler: "team.getTeamSeasonCompetitions",
      config: {
        auth: false,
        middlewares: [validate({ query: teamSeasonCompetitionsQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/team/stats/league/:teamSlug",
      handler: "team.getTeamLeagueStats",
      config: {
        auth: false,
        middlewares: [validate({ params: teamSlugParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/team/schedule/:season/:teamSlug",
      handler: "team.getTeamSchedule",
      config: {
        auth: false,
        middlewares: [validate({ params: teamGamesParamsSchema })],
      },
    },

    {
      method: "GET",
      path: "/team/leaders",
      handler: "team.getTeamLeaders",
      config: {
        auth: false,
        middlewares: [validate({ query: teamLeadersQuerySchema })],
      },
    },

    {
      method: "GET",
      path: "/team/stats/:season/league/:teamSlug",
      handler: "team.getTeamSeasonLeagueStats",
      config: {
        auth: false,
        middlewares: [validate({ params: teamAverageParamsSchema })],
      },
    },

    {
      method: "GET",
      path: "/team/stats/:season/total/:teamSlug",
      handler: "team.getTeamSeasonStats",
      config: {
        auth: false,
        middlewares: [validate({ params: teamRecordParamsSchema })],
      },
    },
  ],
};
