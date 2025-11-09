"use strict";
/**
 * game controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("api::game.game", ({ strapi }) => ({
    async findGames(ctx) {
        const { type, season, competition } = ctx.query;
        if (type === "seasons") {
            const seasons = await strapi.db.query("api::game.game").findMany({
                select: ["season"],
            });
            ctx.body = [...new Set(seasons.map((s) => s.season))];
            return;
        }
        if (type === "competitions" && season) {
            const games = await strapi.db.query("api::game.game").findMany({
                where: { season },
                populate: {
                    competition: { fields: ["id", "name"] },
                },
            });
            const competitions = [
                ...new Map(games
                    .filter((g) => g.competition)
                    .map((g) => [g.competition.id, g.competition])).values(),
            ];
            ctx.body = competitions;
            return;
        }
        if (type === "games" && season && competition) {
            const games = await strapi.db.query("api::game.game").findMany({
                where: { season, competition: { id: competition } },
                populate: ["competition", "teams", "home_team", "away_team"],
            });
            ctx.body = games;
            return;
        }
        ctx.throw(400, "Invalid query parameters");
    },
}));
