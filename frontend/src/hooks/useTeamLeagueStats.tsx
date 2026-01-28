import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { TeamStats } from '@/types/api/team';
import { CellContext, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import { useLeagueDetails } from './queries/league/useLeagueDetails';

export const useTeamLeagueStatsTable = (data: TeamStats[] | undefined) => {
	const table = useReactTable<TeamStats>({
		data: data || [],
		columns: [
			{
				header: 'League',
				accessorKey: 'league_slug',
				cell: (info) => <LeagueCell leagueSlug={info.getValue()} />,
				enableSorting: false
			},
			{
				header: 'GP',
				accessorKey: 'games',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => <Cell info={info} />,

				sortingFn: 'alphanumeric'
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => <Cell info={info} />,

				sortingFn: 'alphanumeric'
			},
			{
				header: 'W%',
				accessorKey: 'win_percentage',

				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'PTS S',
				accessorKey: 'points_scored',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'PTS R',
				accessorKey: 'points_received',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'Diff',
				accessorKey: 'points_diff',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'ATT',
				accessorKey: 'attendance',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		initialState: { sorting: [{ id: 'games', desc: true }] }
	});

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b-2 border-blue-500">
						{headerGroup.headers.map((header, index) => {
							const sticky =
								index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 bg-slate-100' : '';

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									onClick={header.column.getToggleSortingHandler()}
									className={`px-4 py-3 whitespace-nowrap text-center font-semibold text-gray-700 bg-slate-100 ${sticky} ${header.column.getCanSort() ? 'cursor-pointer hover:bg-slate-200 transition-colors select-none' : ''}`}
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
					<tr key={row.id} className="hover:bg-blue-50 transition-colors group">
						{row.getVisibleCells().map((cell, index) => {
							const sticky =
								index === 0
									? 'text-left whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-blue-50'
									: '';

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
					<tr key={row.id} className="bg-slate-100">
						{row.getVisibleCells().map((cell, index) => {
							const sticky =
								index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 bg-slate-100' : '';

							return (
								<td
									key={cell.id}
									className={`px-4 py-3 border-t-2 border-blue-500 font-bold text-center text-gray-800 ${sticky}`}
								>
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
		if (!leagueSlug) return <p>Total</p>;
		const leagueName = league?.name || '';
		return <Link to={APP_ROUTES.league(leagueSlug)}>{leagueName}</Link>;
	};

	const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const value = info.getValue();

		return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
	};

	return { table, TableHead, TableBody, TableFoot };
};
