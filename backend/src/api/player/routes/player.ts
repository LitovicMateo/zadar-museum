/**
 * player router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::player.player", {
  config: {
    find: { auth: false },
    findOne: { auth: false },
    create: { policies: ["global::require-auth-for-writes"] },
    update: { policies: ["global::require-auth-for-writes"] },
    delete: { policies: ["global::require-auth-for-writes"] },
  },
});
