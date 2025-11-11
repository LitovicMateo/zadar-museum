export default {
  routes: [
    {
      method: "GET",
      path: "/staff-members/gamelog/:staffId",
      handler: "staff.getStaffGames",
      config: {
        auth: false,
      },
    },
  ],
};
