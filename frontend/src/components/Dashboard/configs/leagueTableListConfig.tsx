import { LeagueTableRecord } from '@/types/api/LeagueTable';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const leagueTableListConfig: EntityListConfig<LeagueTableRecord> = {
  title: 'League Tables',
  entityType: 'league-table',
  apiRoute: API_ROUTES.adminList.leagueTables,
  searchPlaceholder: 'Search by season...',
  createPath: APP_ROUTES.dashboard.leagueTable.create,
  editPath: (id) => `${APP_ROUTES.dashboard.leagueTable.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.leagueTable,
  deleteLabel: (row) =>
    `${row.competition?.name ?? 'League'} — ${row.season} — ${row.stageName ?? ''}`,
  columns: [
    { header: 'ID', cell: (row) => row.id, className: 'text-muted-foreground text-sm' },
    {
      header: 'Competition',
      cell: (row) => <span className="font-medium">{row.competition?.name ?? '-'}</span>,
    },
    { header: 'Season', cell: (row) => row.season ?? '-', className: 'text-muted-foreground' },
    { header: 'Stage', cell: (row) => row.stageName ?? '-', className: 'text-muted-foreground' },
  ],
};
