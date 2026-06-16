/**
 * stats service
 */

import { getCached, TTL_24H } from '../../../utils/cache';
import {
  aggregatePlayerStats,
  aggregatePlayerRecords,
  aggregateTeamStats,
  aggregateTeamRecords,
  aggregateCoachRecord,
  aggregateRefereeStats,
} from '../../../lib/aggregation/queries';
import { getMainTeamSlug } from '../../../lib/mainTeam';

// Normalize optional filter params: null/undefined/"all" → 'all' for location,
// null/undefined/"all" → undefined for league/season/role.
function normalizeLocation(v: string | null | undefined): 'all' | 'home' | 'away' | 'neutral' {
  if (!v || v.toLowerCase() === 'all') return 'all';
  return v as 'home' | 'away' | 'neutral';
}

function normalizeOptional(v: string | null | undefined): string | undefined {
  if (!v || v.toLowerCase() === 'all') return undefined;
  return v;
}

export default ({ strapi }) => ({
  async findPlayersAllTimeStats(stats, location, league, season, database) {
    const cacheKey = `zadar:stats:players-all-time:${database}:${stats}:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const params = {
        database: database as 'zadar' | 'opponent',
        stats: stats as 'average' | 'total',
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
      };
      const [data, prevData] = await Promise.all([
        aggregatePlayerStats(knex, { ...params, prev: false }),
        aggregatePlayerStats(knex, { ...params, prev: true }),
      ]);
      return { current: data, previous: prevData };
    });
  },

  async findPlayersGameStats(game, team) {
    // Per-game queries are not cached — filtered by specific gameId + teamId
    const data = await strapi.entityService.findMany(
      "api::player-stats.player-stat",
      {
        filters: {
          game: { id: { $eq: game } },
          team: { id: { $eq: team } },
        },
        populate: {
          game: {
            populate: {
              competition: true,
            },
          },
          player: true,
          team: true,
        },
      },
    );

    return data;
  },

  async findPlayersRecords(database, location, league, season, sortKey) {
    const cacheKey = `zadar:stats:player-records:${database}:${location}:${league}:${season}:${sortKey || 'points'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const data = await aggregatePlayerRecords(knex, {
        database: database as 'zadar' | 'opponent',
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
      });
      const key = sortKey || 'points';
      return data.slice().sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
    });
  },

  async findTeamsAllTimeStats(location, league, season) {
    const cacheKey = `zadar:stats:teams-all-time:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const results = await aggregateTeamStats(knex, {
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
        excludeMainTeam: true,
      });
      const mainTeamSlug = await getMainTeamSlug();
      return results.filter((row) => row.team_slug !== mainTeamSlug);
    });
  },

  async findTeamsGameStats(game, team) {
    // Per-game queries are not cached — filtered by specific gameId + teamId
    const data = await strapi.entityService.findMany(
      "api::team-stats.team-stat",
      {
        filters: {
          game: { id: { $eq: game } },
          team: { id: { $eq: team } },
        },
        populate: {
          game: {
            populate: {
              competition: true,
            },
          },
          team: true,
          coach: true,
          assistantCoach: true,
        },
      },
    );

    return data;
  },

  async findTeamRecords(database, season, league, location, sortKey) {
    const cacheKey = `zadar:stats:team-records:${database}:${season}:${league}:${location}:${sortKey || 'games'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const data = await aggregateTeamRecords(knex, {
        database: database as 'zadar' | 'opponent',
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
      });
      const key = sortKey || 'games';
      return data.slice().sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
    });
  },

  async findCoachesAllTimeStats(database, role, location, league, season) {
    const cacheKey = `zadar:stats:coaches-all-time:${database}:${role}:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const normalizedRole = normalizeOptional(role) as 'head' | 'assistant' | undefined;
      const params = {
        database: database as 'zadar' | 'opponent',
        role: normalizedRole,
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
      };
      const [data, prevData] = await Promise.all([
        aggregateCoachRecord(knex, { ...params, prev: false }),
        aggregateCoachRecord(knex, { ...params, prev: true }),
      ]);
      return { current: data, previous: prevData };
    });
  },

  async findRefereesAllTimeStats(location, league, season) {
    const cacheKey = `zadar:stats:referees-all-time:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      return aggregateRefereeStats(knex, {
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
      });
    });
  },
});
