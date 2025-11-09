/**
 * venue controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::venue.venue",
  ({ strapi }) => ({
    async getVenueDetails(ctx) {
      const { venueSlug } = ctx.params;

      const service = strapi.service("api::venue.venue");
      const data = await service.findVenueDetails(venueSlug);
      ctx.body = data;
    },
    async getVenueGamelog(ctx) {
      const { venueSlug, season } = ctx.params;

      const service = strapi.service("api::venue.venue");
      const data = await service.findVenueGamelog(venueSlug, season);

      ctx.body = data;
    },

    async getVenueTeamRecord(ctx) {
      const { venueSlug } = ctx.params;

      const service = strapi.service("api::venue.venue");
      const data = await service.findVenueTeamRecord(venueSlug);

      ctx.body = data[0];
    },

    async getVenueSeasons(ctx) {
      const { venueSlug } = ctx.params;
      const service = strapi.service("api::venue.venue");
      const data = await service.findVenueSeasons(venueSlug);

      const seasons = data
        .map((s: { season: string }) => s.season)
        .sort((a: string, b: string) => +b - +a);
      ctx.body = seasons;
    },

    async getVenueSeasonCompetitions(ctx) {
      const { venueSlug, season } = ctx.params;
      const service = strapi.service("api::venue.venue");
      const data = await service.findVenueSeasonCompetitions(venueSlug, season);
      ctx.body = data;
    },

    async getVenueSeasonStats(ctx) {
      const { venueSlug, season } = ctx.params;
      const service = strapi.service("api::venue.venue");
      const data = await service.findVenueSeasonStats(venueSlug, season);
      ctx.body = data;
    },

    async getVenueSeasonLeagueStats(ctx) {
      const { venueSlug, season } = ctx.params;
      const service = strapi.service("api::venue.venue");
      const data = await service.findVenueSeasonLeagueStats(venueSlug, season);
      ctx.body = data;
    },
  })
);
