/**
 *  service
 */

import { factories } from '@strapi/strapi';

type StandingRow = {
  team: number;
  teamName: string | null;
  teamShortName: string | null;
  gamesPlayed: number;
  wins: number;
  draws: number | null;
  losses: number;
  pointsDiff: number;
  points: number;
};

export default factories.createCoreService(
  'api::league-tables.league-table',
  ({ strapi }) => ({
    async checkDuplicate(
      competitionId: number,
      season: string,
      stageNumber: number
    ) {
      return strapi.db.query('api::league-tables.league-table').findOne({
        where: {
          competition: competitionId,
          season,
          stageNumber,
        },
      });
    },

    async findByLeague(leagueSlug: string, season: string) {
      const competition = await strapi.db
        .query('api::competition.competition')
        .findOne({ where: { slug: leagueSlug } });

      if (!competition) return [];

      const tables = await strapi.db
        .query('api::league-tables.league-table')
        .findMany({
          where: { competition: competition.id, season },
          orderBy: { stageNumber: 'asc' },
        });

      if (!tables.length) return [];

      // Collect every team id referenced across all tables' standings, then
      // batch-load their name/slug/image so the frontend renders directly.
      const teamIds = new Set<number>();
      for (const table of tables) {
        for (const row of (table.standings ?? []) as StandingRow[]) {
          if (row.team != null) teamIds.add(Number(row.team));
        }
      }

      const teams = teamIds.size
        ? await strapi.db.query('api::team.team').findMany({
            where: { id: { $in: Array.from(teamIds) } },
            populate: ['image'],
          })
        : [];

      const teamById = new Map<number, any>(teams.map((t: any) => [t.id, t]));

      return tables.map((table: any) => ({
        id: table.id,
        documentId: table.documentId,
        season: table.season,
        stageNumber: table.stageNumber,
        stageName: table.stageName,
        standings: ((table.standings ?? []) as StandingRow[]).map((row, index) => {
          const team = teamById.get(Number(row.team));
          return {
            position: index + 1,
            teamId: row.team,
            // Prefer the season-correct display name/abbreviation stored on the row,
            // falling back to the team's current primary name.
            teamName: row.teamName ?? team?.name ?? null,
            teamShortName: row.teamShortName ?? team?.short_name ?? null,
            teamSlug: team?.slug ?? null,
            teamImage: team?.image?.url ?? null,
            gamesPlayed: row.gamesPlayed,
            wins: row.wins,
            draws: row.draws ?? null,
            losses: row.losses,
            pointsDiff: row.pointsDiff,
            points: row.points,
          };
        }),
      }));
    },
  })
);
