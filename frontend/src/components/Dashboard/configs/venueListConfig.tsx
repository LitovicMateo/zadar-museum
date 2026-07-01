import { VenueDetailsResponse } from '@/types/api/Venue';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const venueListConfig: EntityListConfig<VenueDetailsResponse> = {
  title: 'Venues',
  entityType: 'venue',
  apiRoute: API_ROUTES.adminList.venues,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.venue.create,
  editPath: (id) => `${APP_ROUTES.dashboard.venue.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.venue,
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
    { header: 'City', cell: (row) => row.city ?? '—', className: 'text-muted-foreground' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-muted-foreground text-sm' },
  ],
};
