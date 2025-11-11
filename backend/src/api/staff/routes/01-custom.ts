export default {
  routes: [
    {
      method: "GET",
      path: "/staff/gamelog/:staffId",
      handler: "staff.getStaffGames",
      config: {
        auth: false,
      },
    },
  ],
};
