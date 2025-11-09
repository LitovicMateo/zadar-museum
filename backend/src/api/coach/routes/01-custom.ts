export default {
  routes: [
    {
      method: "GET",
      path: "/coach/:coachId",
      handler: "coach.getCoachDetails",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/coach/seasons/:coachId",
      handler: "coach.getCoachSeasons",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/coach/competitions/:season/:coachId",
      handler: "coach.getCoachSeasonCompetitions",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/coach/gamelog/:coachId/:db",
      handler: "coach.getCoachGamelog",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/coach/team-record/:coachId/:db",
      handler: "coach.getCoachTeamRecord",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/coach/league-stats/:coachId/:db",
      handler: "coach.getCoachLeagueRecord",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/coach/teams/:coachId",
      handler: "coach.getCoachTeams",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/coach/stats/league/:coachId/:season/:db",
      handler: "coach.getCoachLeagueSeasonStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/coach/stats/total/:coachId/:season/:db",
      handler: "coach.getCoachTotalSeasonStats",
      config: {
        auth: false,
      },
    },
  ],
};
