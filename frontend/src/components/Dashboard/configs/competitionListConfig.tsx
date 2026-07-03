import { CompetitionDetailsResponse } from '@/types/api/Competition';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const competitionListConfig: EntityListConfig<CompetitionDetailsResponse> = {
  title: 'Competitions',
  entityType: 'competition',
  apiRoute: API_ROUTES.adminList.competitions,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.competition.create,
  editPath: (id) => `${APP_ROUTES.dashboard.competition.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.competition,
  deleteLabel: (row) => row.name,
  columns: [
    { header: 'Name', cell: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Short', cell: (row) => row.short_name ?? '—', className: 'text-muted-foreground' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-muted-foreground text-sm' },
  ],
};
