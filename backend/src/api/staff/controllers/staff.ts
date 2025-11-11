/**
 * staff controller
 */

import { factories } from "@strapi/strapi";

// Core controller for the staff content-type. We extend it with one custom action
// that returns schedule rows (gamelog) for a given staff member.
export default factories.createCoreController(
  "api::staff-old.staff-old" as any,
  ({ strapi }) => ({
    async getStaffGames(ctx) {
      const staffId = ctx.params?.staffId || ctx.params?.id;

      if (!staffId) {
        return ctx.badRequest("staffId parameter is required");
      }

      try {
        const service: any = strapi.service("api::staff-old.staff-old");
        const data = await service.getStaffSchedule(staffId);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
