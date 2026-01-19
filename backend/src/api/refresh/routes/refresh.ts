export default {
  routes: [
    {
      method: "GET",
      path: "/refresh/views",
      handler: "refresh.refreshViews",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },

    {
      method: "GET",
      path: "/refresh/schedule",
      handler: "refresh.refreshSchedule",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
  ],
};
