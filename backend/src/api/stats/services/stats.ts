/**
 * stats service
 */

import { getCached, TTL_24H, CACHE_PREFIX } from '../../../utils/cache';
import {
  aggregatePlayerStats,
  aggregatePlayerRecords,
  aggregateTeamStats,
  aggregateTeamRecords,
  aggregateCoachRecord,
  aggregateRefereeStats,
  listMainTeamPlayers,
  listMainTeamCoaches,
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
  async findPlayersAllTimeStats(stats, location, league, season, database, phase) {
    const cacheKey = `${CACHE_PREFIX}stats:players-all-time:${database}:${stats}:${location}:${league}:${season}:${phase || 'all'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const params = {
        database: database as 'main' | 'opponent',
        stats: stats as 'average' | 'total',
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
        phase: normalizeOptional(phase) as 'regular' | 'playoff' | undefined,
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

  async findPlayersRecords(database, location, league, season, sortKey, phase) {
    const cacheKey = `${CACHE_PREFIX}stats:player-records:${database}:${location}:${league}:${season}:${sortKey || 'points'}:${phase || 'all'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const data = await aggregatePlayerRecords(knex, {
        database: database as 'main' | 'opponent',
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
        phase: normalizeOptional(phase) as 'regular' | 'playoff' | undefined,
      });
      const key = sortKey || 'points';
      return data.slice().sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
    });
  },

  async findTeamsAllTimeStats(location, league, season, phase) {
    const cacheKey = `${CACHE_PREFIX}stats:teams-all-time:${location}:${league}:${season}:${phase || 'all'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const results = await aggregateTeamStats(knex, {
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
        phase: normalizeOptional(phase) as 'regular' | 'playoff' | undefined,
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

  async findTeamRecords(database, season, league, location, sortKey, phase) {
    const cacheKey = `${CACHE_PREFIX}stats:team-records:${database}:${season}:${league}:${location}:${sortKey || 'games'}:${phase || 'all'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const data = await aggregateTeamRecords(knex, {
        database: database as 'main' | 'opponent',
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
        phase: normalizeOptional(phase) as 'regular' | 'playoff' | undefined,
      });
      const key = sortKey || 'games';
      return data.slice().sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
    });
  },

  async findCoachesAllTimeStats(database, role, location, league, season, phase) {
    const cacheKey = `${CACHE_PREFIX}stats:coaches-all-time:${database}:${role}:${location}:${league}:${season}:${phase || 'all'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const normalizedRole = normalizeOptional(role) as 'head' | 'assistant' | undefined;
      const params = {
        database: database as 'main' | 'opponent',
        role: normalizedRole,
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
        phase: normalizeOptional(phase) as 'regular' | 'playoff' | undefined,
      };
      const [data, prevData] = await Promise.all([
        aggregateCoachRecord(knex, { ...params, prev: false }),
        aggregateCoachRecord(knex, { ...params, prev: true }),
      ]);
      return { current: data, previous: prevData };
    });
  },

  async findRefereesAllTimeStats(location, league, season, phase) {
    const cacheKey = `${CACHE_PREFIX}stats:referees-all-time:${location}:${league}:${season}:${phase || 'all'}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      return aggregateRefereeStats(knex, {
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
        phase: normalizeOptional(phase) as 'regular' | 'playoff' | undefined,
      });
    });
  },

  async findPlayersCompareStats(ids, stats, location, league, season) {
    const [id1, id2] = String(ids).split(',').map((id) => id.trim());
    const cacheKey = `${CACHE_PREFIX}stats:players-compare:${id1}:${id2}:${stats}:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const params = {
        database: 'main' as const,
        stats: stats as 'average' | 'total',
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
      };
      const [rows1, rows2] = await Promise.all([
        aggregatePlayerStats(knex, { ...params, playerId: id1 }),
        aggregatePlayerStats(knex, { ...params, playerId: id2 }),
      ]);
      return { player1: rows1[0] ?? null, player2: rows2[0] ?? null };
    });
  },

  async findPlayersRoster() {
    const knex = strapi.db.connection;
    return listMainTeamPlayers(knex);
  },

  async findCoachesCompareStats(ids, location, league, season) {
    const [id1, id2] = String(ids).split(',').map((id) => id.trim());
    const cacheKey = `${CACHE_PREFIX}stats:coaches-compare:${id1}:${id2}:${location}:${league}:${season}`;
    return getCached(cacheKey, TTL_24H, async () => {
      const knex = strapi.db.connection;
      const params = {
        database: 'main' as const,
        location: normalizeLocation(location),
        league: normalizeOptional(league),
        season: normalizeOptional(season),
      };
      const [rows1, rows2] = await Promise.all([
        aggregateCoachRecord(knex, { ...params, coachId: id1 }),
        aggregateCoachRecord(knex, { ...params, coachId: id2 }),
      ]);
      return { coach1: rows1[0] ?? null, coach2: rows2[0] ?? null };
    });
  },

  async findCoachesRoster() {
    const knex = strapi.db.connection;
    return listMainTeamCoaches(knex);
  },
});
