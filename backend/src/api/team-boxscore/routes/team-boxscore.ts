export default {
  routes: [
    {
      method: "GET",
      path: "/team-boxscores",
      handler: "team-boxscore.find", // match controller file name
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team-boxscore/game",
      handler: "team-boxscore.getGameBoxscore",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team-boxscore/seasons",
      handler: "team-boxscore.getTeamUniqueSeasons",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/team-boxscore/head-to-head/:teamSlug",
      handler: "team-boxscore.getTeamHeadToHead",
      config: {
        auth: false,
      },
    },
  ],
};
