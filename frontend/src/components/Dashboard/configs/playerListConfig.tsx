import { Link } from 'react-router-dom';
import { PlayerResponse } from '@/types/api/Player';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const playerListConfig: EntityListConfig<PlayerResponse> = {
  title: 'Players',
  entityType: 'player',
  apiRoute: API_ROUTES.adminList.players,
  searchPlaceholder: 'Search by name...',
  createPath: APP_ROUTES.dashboard.player.create,
  editPath: (id) => `${APP_ROUTES.dashboard.player.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.player,
  deleteLabel: (row) => `${row.first_name} ${row.last_name}`,
  columns: [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.image?.url
            ? <img src={row.image.url} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
            : <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0" />}
          <Link to={APP_ROUTES.player(row.documentId)} className="font-medium hover:underline">
            {row.first_name} {row.last_name}
          </Link>
        </div>
      ),
    },
    { header: 'Position', cell: (row) => row.primary_position?.toUpperCase() ?? '-', className: 'text-muted-foreground' },
    { header: 'Active', cell: (row) => (row.is_active_player ? 'Yes' : 'No'), className: 'text-muted-foreground' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-muted-foreground text-sm' },
  ],
};
