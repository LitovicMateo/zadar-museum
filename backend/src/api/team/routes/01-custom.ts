export default {
  routes: [
    {
      method: "GET",
      path: "/team/details/:teamSlug",
      handler: "team.getTeamDetails",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team/stats/total/:teamSlug",
      handler: "team.getTeamAllTimeStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team/seasons/:teamSlug",
      handler: "team.getTeamSeasons",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team/competitions/:teamSlug",
      handler: "team.getTeamCompetitions",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team/competitions",
      handler: "team.getTeamSeasonCompetitions",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team/stats/league/:teamSlug",
      handler: "team.getTeamLeagueStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team/schedule/:season/:teamSlug",
      handler: "team.getTeamSchedule",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/team/leaders",
      handler: "team.getTeamLeaders",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/team/stats/:season/league/:teamSlug",
      handler: "team.getTeamSeasonLeagueStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/team/stats/:season/total/:teamSlug",
      handler: "team.getTeamSeasonStats",
      config: {
        auth: false,
      },
    },
  ],
};
