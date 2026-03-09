import { Context } from "koa";

type RefreshService = {
  refreshAllViews: () => Promise<{ count: number; refreshedViews: string[]; failedViews: string[] }>;
  refreshSingleView: (name: string) => Promise<void>;
};

export default {
  async refreshViews(ctx: Context) {
    try {
      const service = strapi.service("api::refresh.refresh") as RefreshService;
      const { count, refreshedViews } = await service.refreshAllViews();

      ctx.body = {
        success: true,
        message: `Refreshed ${count} materialized view(s).`,
        count,
        refreshedViews,
      };
    } catch (err: any) {
      strapi.log.error("[refresh] refreshViews failed:", err);
      ctx.throw(500, `Failed to refresh views: ${err.message}`);
    }
  },

  async refreshSchedule(ctx: Context) {
    try {
      const service = strapi.service("api::refresh.refresh") as RefreshService;
      await service.refreshSingleView("schedule");

      ctx.body = { success: true, message: "Schedule refreshed." };
    } catch (err: any) {
      strapi.log.error("[refresh] refreshSchedule failed:", err);
      ctx.throw(500, `Failed to refresh schedule: ${err.message}`);
    }
  },
};
