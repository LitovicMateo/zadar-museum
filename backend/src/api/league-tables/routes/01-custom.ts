export default {
  routes: [
    {
      method: "GET",
      path: "/league-tables/check-duplicate",
      handler: "league-table.checkDuplicate",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/league-tables/by-league/:leagueSlug/:season",
      handler: "league-table.findByLeague",
      config: {
        auth: false,
      },
    },
  ],
};
