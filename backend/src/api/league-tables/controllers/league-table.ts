/**
 *  controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::league-tables.league-table',
  ({ strapi }) => ({
    async checkDuplicate(ctx) {
      const { competition, season, stageNumber } = ctx.query as {
        competition?: string;
        season?: string;
        stageNumber?: string;
      };

      if (!competition || !season || stageNumber === undefined) {
        return ctx.throw(
          400,
          "'competition', 'season' and 'stageNumber' query params are required"
        );
      }

      const service = strapi.service('api::league-tables.league-table') as any;
      const existing = await service.checkDuplicate(
        Number(competition),
        season,
        Number(stageNumber)
      );

      ctx.body = existing
        ? { isDuplicate: true, existingId: existing.id }
        : { isDuplicate: false };
    },

    async findByLeague(ctx) {
      const { leagueSlug, season } = ctx.params as {
        leagueSlug?: string;
        season?: string;
      };

      if (!leagueSlug || !season) {
        return ctx.throw(400, "'leagueSlug' and 'season' params are required");
      }

      const service = strapi.service('api::league-tables.league-table') as any;
      ctx.body = await service.findByLeague(leagueSlug, season);
    },
  })
);
