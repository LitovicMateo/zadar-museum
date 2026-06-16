import { GameDetailsResponse } from '@/types/api/Game';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const gameListConfig: EntityListConfig<GameDetailsResponse> = {
  title: 'Games',
  entityType: 'game',
  apiRoute: API_ROUTES.adminList.games,
  searchPlaceholder: 'Search by season...',
  createPath: APP_ROUTES.dashboard.game.create,
  editPath: (id) => `${APP_ROUTES.dashboard.game.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.game,
  deleteLabel: (row) => `${row.home_team_name} vs ${row.away_team_name} (${row.season})`,
  columns: [
    {
      header: 'Match',
      cell: (row) => <span className="font-medium">{row.home_team_name} vs {row.away_team_name}</span>,
    },
    { header: 'Season', cell: (row) => row.season, className: 'text-slate-400' },
    { header: 'Round', cell: (row) => row.round ?? '—', className: 'text-slate-400' },
    {
      header: 'Date',
      cell: (row) => row.date ? new Date(row.date).toLocaleDateString() : '—',
      className: 'text-slate-400 text-sm',
    },
  ],
};
