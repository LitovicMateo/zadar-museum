import { PlayerStatsResponse } from '@/types/api/PlayerStats';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const playerStatsListConfig: EntityListConfig<PlayerStatsResponse> = {
  title: 'Player Stats',
  entityType: 'player-stats',
  apiRoute: API_ROUTES.adminList.playerStats,
  searchPlaceholder: 'Search by season...',
  createPath: APP_ROUTES.dashboard.playerStats.create,
  editPath: (id) => `${APP_ROUTES.dashboard.playerStats.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.playerStats,
  deleteLabel: (row) =>
    `${row.player?.first_name ?? ''} ${row.player?.last_name ?? ''} — ${row.game?.home_team_name ?? ''} vs ${row.game?.away_team_name ?? ''}`,
  columns: [
    {
      header: 'Player',
      cell: (row) => (
        <span className="font-medium">
          {row.player?.first_name} {row.player?.last_name}
        </span>
      ),
    },
    { header: 'Team', cell: (row) => row.team?.name ?? '—', className: 'text-slate-400' },
    {
      header: 'Game',
      cell: (row) => row.game ? `${row.game.home_team_name} vs ${row.game.away_team_name}` : '—',
      className: 'text-slate-400 text-sm',
    },
    { header: 'Pts', cell: (row) => row.points ?? '—', className: 'text-slate-400' },
    { header: 'Status', cell: (row) => row.status, className: 'text-slate-400 text-sm' },
  ],
};
