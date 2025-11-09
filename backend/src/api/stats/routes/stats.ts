export default {
  routes: [
    {
      method: "GET",
      path: "/stats/player/all-time",
      handler: "stats.getPlayersAllTimeStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/stats/player/game",
      handler: "stats.getPlayersGameStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/stats/player/records",
      handler: "stats.getPlayersRecords",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/stats/team/all-time",
      handler: "stats.getTeamsAllTimeStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/stats/team/game",
      handler: "stats.getTeamsGameStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/stats/team/records",
      handler: "stats.getTeamRecords",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/stats/coach/all-time",
      handler: "stats.getCoachesAllTimeStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/stats/referee/all-time",
      handler: "stats.getRefereesAllTimeStats",
      config: {
        auth: false,
      },
    },
  ],
};
