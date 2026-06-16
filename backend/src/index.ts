import type { Core } from '@strapi/strapi';
import pg from 'pg';

pg.types.setTypeParser(114, JSON.parse);   // JSON
pg.types.setTypeParser(3802, JSON.parse);  // JSONB

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await strapi.db.connection.raw('CREATE EXTENSION IF NOT EXISTS unaccent;');
  },
};
