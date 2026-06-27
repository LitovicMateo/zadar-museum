import { invalidateMainTeamCache } from '../../../../lib/mainTeam';

export default {
  async beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    if (event.params.data.isMainTeam === true) {
      await strapi.db.connection.raw(`UPDATE teams SET is_main_team = false WHERE is_main_team = true`);
    }
  },

  async beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    if (event.params.data.isMainTeam === true) {
      await strapi.db.connection.raw(`UPDATE teams SET is_main_team = false WHERE is_main_team = true`);
    }
  },

  async afterCreate(event: { params: { data: Record<string, unknown> } }) {
    if (event.params.data.isMainTeam === true) {
      invalidateMainTeamCache();
    }
  },

  async afterUpdate(event: { params: { data: Record<string, unknown> } }) {
    if (event.params.data.isMainTeam === true) {
      invalidateMainTeamCache();
    }
  },
};
