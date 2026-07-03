import { TeamStatsResponse } from '@/types/api/TeamStats';
import { API_ROUTES, APP_ROUTES } from '@/constants/Routes';
import { EntityListConfig } from '../EntityListPage/types';

export const teamStatsListConfig: EntityListConfig<TeamStatsResponse> = {
  title: 'Team Stats',
  entityType: 'team-stats',
  apiRoute: API_ROUTES.adminList.teamStats,
  searchPlaceholder: 'Search by season...',
  createPath: APP_ROUTES.dashboard.teamStats.create,
  editPath: (id) => `${APP_ROUTES.dashboard.teamStats.edit}${id}`,
  deleteApiRoute: API_ROUTES.delete.teamStats,
  deleteLabel: (row) =>
    `${row.team?.name ?? 'Team'} — ${row.game?.home_team_name ?? ''} vs ${row.game?.away_team_name ?? ''}`,
  columns: [
    { header: 'Team', cell: (row) => <span className="font-medium">{row.team?.name ?? '—'}</span> },
    {
      header: 'Game',
      cell: (row) => row.game ? `${row.game.home_team_name} vs ${row.game.away_team_name}` : '—',
      className: 'text-muted-foreground text-sm',
    },
    {
      header: 'Coach',
      cell: (row) => row.coach ? `${row.coach.first_name} ${row.coach.last_name}` : '—',
      className: 'text-muted-foreground',
    },
  ],
};
