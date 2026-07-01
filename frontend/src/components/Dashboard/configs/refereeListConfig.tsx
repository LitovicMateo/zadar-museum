import { RefereeDetailsResponse } from '@/types/api/Referee';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const refereeListConfig: EntityListConfig<RefereeDetailsResponse> = {
  title: 'Referees',
  entityType: 'referee',
  apiRoute: API_ROUTES.adminList.referees,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.referee.create,
  editPath: (id) => `${APP_ROUTES.dashboard.referee.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.referee,
  deleteLabel: (row) => `${row.first_name} ${row.last_name}`,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image?.url
            ? <img src={row.image.url} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0" />}
          <span className="font-medium">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-muted-foreground text-sm' },
  ],
};
