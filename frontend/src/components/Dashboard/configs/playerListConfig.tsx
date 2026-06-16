import { PlayerResponse } from '@/types/api/Player';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const playerListConfig: EntityListConfig<PlayerResponse> = {
  title: 'Players',
  entityType: 'player',
  apiRoute: API_ROUTES.adminList.players,
  searchPlaceholder: 'Search by last name...',
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
            : <div className="w-7 h-7 rounded-full bg-slate-700 flex-shrink-0" />}
          <span className="font-medium">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    { header: 'Position', cell: (row) => row.primary_position ?? '—', className: 'text-slate-400' },
    { header: 'Active', cell: (row) => (row.is_active_player ? 'Yes' : 'No'), className: 'text-slate-400' },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString(), className: 'text-slate-400 text-sm' },
  ],
};
