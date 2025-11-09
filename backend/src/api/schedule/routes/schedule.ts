export default {
  routes: [
    {
      method: "GET",
      path: "/schedules",
      handler: "schedule.find",
      config: {
        auth: false,
      },
    },
  ],
};
