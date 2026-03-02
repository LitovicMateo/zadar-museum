export default {
  routes: [
    {
      method: "GET",
      path: "/player-stats/check-duplicate",
      handler: "player-stat.checkDuplicate",
      config: {
        auth: false,
      },
    },
  ],
};
