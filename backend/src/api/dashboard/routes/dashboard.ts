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

    {
      method: "GET",
      path: "/dashboard/staff",
      handler: "dashboard.getStaff",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/dashboard/admin/players",
      handler: "dashboard.getPlayersAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/coaches",
      handler: "dashboard.getCoachesAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/referees",
      handler: "dashboard.getRefereesAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/staff",
      handler: "dashboard.getStaffAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/teams",
      handler: "dashboard.getTeamsAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/venues",
      handler: "dashboard.getVenuesAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/competitions",
      handler: "dashboard.getCompetitionsAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/games",
      handler: "dashboard.getGamesAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/player-stats",
      handler: "dashboard.getPlayerStatsAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/team-stats",
      handler: "dashboard.getTeamStatsAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/player-stats/:documentId",
      handler: "dashboard.getPlayerStatByIdAdmin",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/dashboard/admin/team-stats/:documentId",
      handler: "dashboard.getTeamStatByIdAdmin",
      config: { auth: false },
    },
  ],
};
