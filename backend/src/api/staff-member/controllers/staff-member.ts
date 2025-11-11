import { factories } from "@strapi/strapi";

// Controller for the staff-member content-type. Extends the core controller with
// a custom action that returns schedule rows for games involving a staff member.
export default factories.createCoreController(
  "api::staff-member.staff-member" as any,
  ({ strapi }) => ({
    async getStaffGames(ctx) {
      const staffMemberId = ctx.params?.staffMemberId || ctx.params?.id;

      if (!staffMemberId) {
        return ctx.badRequest("staffMemberId parameter is required");
      }

      try {
        const service: any = strapi.service("api::staff-member.staff-member");
        const data = await service.getStaffSchedule(staffMemberId);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
