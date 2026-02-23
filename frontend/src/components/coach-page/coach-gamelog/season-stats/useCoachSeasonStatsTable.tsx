import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { useLeagueDetails } from '@/hooks/queries/league/useLeagueDetails';
import { CoachStats } from '@/types/api/coach';
import { CellContext, getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useCoachSeasonStatsTable = (data: CoachStats[] | undefined, type: 'league' | 'total') => {
  const table = useReactTable({
    data: data || [],
    columns: [
      {
        header: 'League',
        accessorFn: (row: CoachStats) => row?.league_slug,
        meta: { sticky: 'left', stickyOffset: '0' },
        cell: (info) => {
          if (info.getValue() === undefined) return <p>Total</p>;
          return <LeagueCell leagueSlug={info.getValue() as string | undefined} />;
        }
      },
      {
        header: 'G',
        accessorFn: (row: CoachStats) => row?.games,
        cell: (info) => <Cell info={info} />
      },
      {
        header: 'W',
        accessorFn: (row: CoachStats) => row?.wins,
        cell: (info) => <Cell info={info} />
      },
      {
        header: 'L',
        accessorFn: (row: CoachStats) => row?.losses,
        cell: (info) => <Cell info={info} />
      },
      {
        header: 'Win %',
        accessorFn: (row: CoachStats) => row?.win_percentage,
        cell: (info) => <Cell info={info} />
      },
      {
        header: 'PTS A',
        accessorFn: (row: CoachStats) => row?.points_scored,
        cell: (info) => <Cell info={info} />
      },
      {
        header: 'PTS R',
        accessorFn: (row: CoachStats) => row?.points_received,
        cell: (info) => <Cell info={info} />
      },
      {
        header: 'PTS D',
        accessorFn: (row: CoachStats) => row?.points_difference,
        cell: (info) => <Cell info={info} />
      }
    ],
    getCoreRowModel: getCoreRowModel()
  });

  const LeagueCell: React.FC<{ leagueSlug?: string }> = ({ leagueSlug }) => {
    const { data: league } = useLeagueDetails(leagueSlug || '');
    if (!leagueSlug && type === 'league') return <p>No games</p>;
    const leagueName = league?.name || '';
    return <Link to={APP_ROUTES.league(leagueSlug!)}>{leagueName}</Link>;
  };

  const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
    const value = info.getValue();

    return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
  };

  return { table };
};
