/**
 * staff controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::staff.staff" as any,
  ({ strapi }) => ({
    async getStaffGames(ctx) {
      const { staffId } = ctx.params;

      if (!staffId) {
        return ctx.badRequest("staffId parameter is required");
      }

      try {
        const service = strapi.service("api::staff.staff");
        const data = await service.getStaffSchedule(staffId);
        ctx.body = data;
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
