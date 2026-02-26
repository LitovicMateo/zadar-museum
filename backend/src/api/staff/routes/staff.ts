/**
 * staff router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::staff.staff", {
  config: {
    find: { auth: false },
    findOne: { auth: false },
    create: { policies: ["global::require-auth-for-writes"] },
    update: { policies: ["global::require-auth-for-writes"] },
    delete: { policies: ["global::require-auth-for-writes"] },
  },
});
