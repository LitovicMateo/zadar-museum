import type { Core } from "@strapi/types";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async search(ctx) {
    ctx.body = await strapi
      .service("api::search.search")
      .search(ctx.query.q as string);
  },
});
