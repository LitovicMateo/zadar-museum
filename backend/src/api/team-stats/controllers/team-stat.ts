/**
 *  controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::team-stats.team-stat',
  ({ strapi }) => ({
    async checkDuplicate(ctx) {
      const { game, team } = ctx.query as { game?: string; team?: string };

      if (!game || !team) {
        return ctx.throw(400, "Both 'game' and 'team' query params are required");
      }

      const service = strapi.service('api::team-stats.team-stat') as any;
      const existing = await service.checkDuplicate(Number(game), Number(team));

      ctx.body = existing
        ? { isDuplicate: true, existingId: existing.id }
        : { isDuplicate: false };
    },
  })
);
