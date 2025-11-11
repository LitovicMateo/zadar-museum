/**
 * staff service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::staff.staff",
  ({ strapi }) => ({
    // custom service methods for staff can be added here
  })
);
