export default {
  routes: [
    {
      method: "GET",
      path: "/league/:leagueSlug",
      handler: "competition.getLeagueDetails",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/league/games/:leagueSlug/:season",
      handler: "competition.getLeagueGames",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/league/seasons/:leagueSlug",
      handler: "competition.getLeagueSeasons",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/league/player-rankings/:leagueSlug/:stat",
      handler: "competition.getPlayerLeagueRankings",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/league/coach-rankings/:leagueSlug/:stat",
      handler: "competition.getCoachLeagueRankings",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/league/team-record/:leagueSlug",
      handler: "competition.getLeagueTeamRecord",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/league/team-stats/:leagueSlug/:season",
      handler: "competition.getTeamSeasonLeagueStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/league/player-stats/:leagueSlug/:season",
      handler: "competition.getPlayerSeasonLeagueStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/league/season-leaders/:leagueSlug/:season",
      handler: "competition.getSeasonPlayerLeaders",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/league/season-team-records/:leagueSlug/:season",
      handler: "competition.getSeasonTeamRecords",
      config: {
        auth: false,
      },
    },
  ],
};
