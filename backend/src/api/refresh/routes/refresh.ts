export default {
  routes: [
    {
      method: "GET",
      path: "/refresh/views",
      handler: "refresh.refreshViews",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/refresh/schedule",
      handler: "refresh.refreshSchedule",
      config: {
        auth: false,
      },
    },
  ],
};
