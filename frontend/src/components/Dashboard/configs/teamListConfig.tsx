import { TeamDetailsResponse } from '@/types/api/Team';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const teamListConfig: EntityListConfig<TeamDetailsResponse> = {
  title: 'Teams',
  entityType: 'team',
  apiRoute: API_ROUTES.adminList.teams,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.team.create,
  editPath: (id) => `${APP_ROUTES.dashboard.team.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.team,
  deleteLabel: (row) => row.name,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image?.url
            ? <img src={row.image.url} className="w-7 h-7 rounded object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded bg-muted flex-shrink-0" />}
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: 'Short', cell: (row) => row.short_name ?? '-', className: 'text-muted-foreground' },
    { header: 'City', cell: (row) => row.city ?? '-', className: 'text-muted-foreground' },
    {
      header: 'Main team',
      cell: (row) => row.isMainTeam
        ? <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-900/60 text-blue-200">Main</span>
        : null,
    },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-muted-foreground text-sm' },
  ],
};
