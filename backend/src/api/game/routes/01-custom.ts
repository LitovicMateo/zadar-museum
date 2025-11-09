export default {
  routes: [
    {
      method: "GET",
      path: "/games/q",
      handler: "game.findGames", // will handle seasons, competitions, etc.
    },
    {
      method: "GET",
      path: "/games/:gameId",
      handler: "game.getGameDetails",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/game/score/:gameId",
      handler: "game.getGameScore",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/game/team-stats/:gameId",
      handler: "game.getGameTeamStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/game/boxscore/:gameId/:teamSlug",
      handler: "game.getGameBoxscore",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/game/coaches/:gameId/:teamSlug",
      handler: "game.getTeamCoaches",
      config: {
        auth: false,
      },
    },
  ],
};
