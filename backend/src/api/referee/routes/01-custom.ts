export default {
  routes: [
    {
      method: "GET",
      path: "/referee/gamelog/:refereeId",
      handler: "referee.getRefereeGamelog",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/referee/team-record/:refereeId",
      handler: "referee.getRefereeTeamRecord",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/referee/seasons/:refereeId",
      handler: "referee.getRefereeSeasons",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/referee/competitions/:season/:refereeId",
      handler: "referee.getRefereeSeasonCompetitions",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/referee/stats/:season/total/:refereeId",
      handler: "referee.getRefereeSeasonStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/referee/stats/:season/league/:refereeId",
      handler: "referee.getRefereeSeasonLeagueStats",
      config: {
        auth: false,
      },
    },
  ],
};
