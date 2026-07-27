import { StaffDetailsResponse } from '@/types/api/Staff';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const staffListConfig: EntityListConfig<StaffDetailsResponse> = {
  title: 'Staff',
  entityType: 'staff',
  apiRoute: API_ROUTES.adminList.staff,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.staff.create,
  editPath: (id) => `${APP_ROUTES.dashboard.staff.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.staff,
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
    { header: 'Role', cell: (row) => row.role ?? '-', className: 'text-muted-foreground' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-muted-foreground text-sm' },
  ],
};
