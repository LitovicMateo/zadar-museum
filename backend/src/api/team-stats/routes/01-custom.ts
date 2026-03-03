export default {
  routes: [
    {
      method: "GET",
      path: "/team-stats/check-duplicate",
      handler: "team-stat.checkDuplicate",
      config: {
        auth: false,
      },
    },
  ],
};
