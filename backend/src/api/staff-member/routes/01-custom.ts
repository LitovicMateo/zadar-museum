export default {
  routes: [
    {
      method: "GET",
      path: "/staff-members/gamelog/:staffMemberId",
      handler: "staff-member.getStaffGames",
      config: {
        auth: false,
      },
    },
  ],
};
