export default {
  routes: [
    {
      method: "GET",
      path: "/staff-old/gamelog/:staffId",
      handler: "staff.getStaffGames",
      config: {
        auth: false,
      },
    },
  ],
};
