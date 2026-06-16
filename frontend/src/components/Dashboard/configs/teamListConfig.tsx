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
            : <div className="w-7 h-7 rounded bg-slate-700 flex-shrink-0" />}
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: 'Short', cell: (row) => row.short_name ?? '—', className: 'text-slate-400' },
    { header: 'City', cell: (row) => row.city ?? '—', className: 'text-slate-400' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-slate-400 text-sm' },
  ],
};
