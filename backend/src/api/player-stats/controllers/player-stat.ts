/**
 *  controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::player-stats.player-stat",
  ({ strapi }) => ({
    async checkDuplicate(ctx) {
      const { game, player } = ctx.query as { game?: string; player?: string };

      if (!game || !player) {
        return ctx.throw(400, "Both 'game' and 'player' query params are required");
      }

      const service = strapi.service("api::player-stats.player-stat") as any;
      const existing = await service.checkDuplicate(
        Number(game),
        Number(player)
      );

      ctx.body = existing
        ? { isDuplicate: true, existingId: existing.id }
        : { isDuplicate: false };
    },
  })
);
