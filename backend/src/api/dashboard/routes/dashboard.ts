export default {
  routes: [
    {
      method: "GET",
      path: "/dashboard/seasons",
      handler: "dashboard.getSeasons",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/dashboard/competitions/:season",
      handler: "dashboard.getSeasonCompetitions",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/dashboard/games/:season/:competition",
      handler: "dashboard.getCompetitionGames",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/dashboard/game/teams/:gameId",
      handler: "dashboard.getGameTeams",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/players",
      handler: "dashboard.getPlayers",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/coaches",
      handler: "dashboard.getCoaches",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/referees",
      handler: "dashboard.getReferees",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/teams",
      handler: "dashboard.getTeams",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/venues",
      handler: "dashboard.getVenues",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/competitions",
      handler: "dashboard.getCompetitions",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/games",
      handler: "dashboard.getGames",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/player-stats",
      handler: "dashboard.getPlayerStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/dashboard/team-stats",
      handler: "dashboard.getTeamStats",
      config: {
        auth: false,
      },
    },
  ],
};
