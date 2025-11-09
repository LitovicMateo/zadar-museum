export default {
  routes: [
    {
      method: "GET",
      path: "/schedule/season",
      handler: "schedule.getSeasonSchedule",
    },
    {
      method: "GET",
      path: "/schedule/game",
      handler: "schedule.getGameById",
    },
  ],
};
