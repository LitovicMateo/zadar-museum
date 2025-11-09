export default {
  routes: [
    {
      method: "GET",
      path: "/players/boxscore",
      handler: "player.findPlayersBoxscore",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/stats/:db/all-time",
      handler: "player.findPlayersAllTimeStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/stats/:db/all-time/league",
      handler: "player.findPlayersAllTimeLeagueStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/player-number/:playerId",
      handler: "player.getMostFrequentPlayerNumber",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/seasons/:playerId/:database",
      handler: "player.getPlayerSeasons",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/competitions/:season/:playerId",
      handler: "player.getPlayerSeasonCompetitions",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/teams/:playerId",
      handler: "player.getPlayerTeams",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/stats/:database/career-high/:playerId",
      handler: "player.getCareerHighStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/stats/:database/:season/average/total/:playerId",
      handler: "player.getSeasonAverageStats",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/players/stats/:database/:season/average/league/:playerId",
      handler: "player.getSeasonAverageLeagueStats",
      config: {
        auth: false,
      },
    },
  ],
};
