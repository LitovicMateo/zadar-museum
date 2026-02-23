import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { useLeagueDetails } from '@/hooks/queries/league/useLeagueDetails';
import { CoachStats } from '@/types/api/coach';
import { CellContext, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import styles from './useCoachSeasonStatsTable.module.css';

export const useCoachSeasonStatsTable = (data: CoachStats[] | undefined, type: 'league' | 'total') => {
  const table = useReactTable({
    data: data || [],
    columns: [
      {
        header: 'League',
        accessorFn: (row: CoachStats) => row?.league_slug,
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

  const TableHead: React.FC = () => {
    return (
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className={styles.trBorder}>
            {headerGroup.headers.map((header, index) => {
              const sticky = index === 0 ? styles.stickyLeft : '';

              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  className={`${styles.thBase} ${styles.bgSlate100} ${styles.hoverBg} ${sticky} ${header.column.getCanSort() ? styles.selectNone : ''}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
    );
  };

  const TableBody: React.FC = () => {
    return (
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell, index) => {
              const sticky = index === 0 ? styles.stickyLeftBody : '';

              return (
                <TableCell key={cell.id} sticky={sticky}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  const TableFoot = () => {
    return (
      <tfoot>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell, index) => {
              const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 ' : '';

              return (
                <td key={cell.id} className={`px-4 py-2 border-t-2 border-blue-500 font-bold text-center ${sticky} bg-slate-100`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tfoot>
    );
  };

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

  return { table, TableHead, TableBody, TableFoot };
};
