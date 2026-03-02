/**
 *  service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::team-stats.team-stat',
  ({ strapi }) => ({
    async checkDuplicate(gameId: number, teamId: number) {
      return strapi.db.query('api::team-stats.team-stat').findOne({
        where: {
          game: gameId,
          team: teamId,
        },
      });
    },
  })
);
