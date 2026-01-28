import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { GameStatsEntry } from '@/types/api/player';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import { useLeagueDetails } from './queries/league/useLeagueDetails';

export const usePlayerLeagueStatsTable = (rows: GameStatsEntry[] | undefined) => {
	const table = useReactTable<GameStatsEntry>({
		data: rows || [],
		columns: [
			{
				header: 'League',
				accessorKey: 'league_slug',
				cell: (info) => <LeagueCell leagueSlug={info.getValue()} />,
				enableSorting: false
			},
			{ header: 'GP', accessorKey: 'games' },
			{ header: 'GS', accessorKey: 'games_started' },
			{
				header: 'MIN',
				accessorKey: 'minutes',
				cell: (info) => {
					const val = info.getValue();
					if (val === null || val === undefined || val === '') return '-';
					const n = Number(val);
					return Number.isNaN(n) ? '-' : n.toFixed(1);
				}
			},
			{ header: 'PTS', accessorKey: 'points' },
			{ header: 'OR', accessorKey: 'off_rebounds' },
			{ header: 'DR', accessorKey: 'def_rebounds' },
			{ header: 'REB', accessorKey: 'rebounds' },
			{ header: 'AST', accessorKey: 'assists' },
			{ header: 'STL', accessorKey: 'steals' },
			{ header: 'BLK', accessorKey: 'blocks' },
			{ header: 'FGM', accessorKey: 'field_goals_made' },
			{ header: 'FGA', accessorKey: 'field_goals_attempted' },
			{ header: 'FG%', accessorKey: 'field_goal_percentage' },
			{ header: '3PM', accessorKey: 'three_pointers_made' },
			{ header: '3PA', accessorKey: 'three_pointers_attempted' },
			{ header: '3P%', accessorKey: 'three_point_percentage' },
			{ header: 'FTM', accessorKey: 'free_throws_made' },
			{ header: 'FTA', accessorKey: 'free_throws_attempted' },
			{ header: 'FT%', accessorKey: 'free_throw_percentage' },
			{ header: 'EFF', accessorKey: 'efficiency' }
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b-2 border-blue-500">
						{headerGroup.headers.map((header, index) => {
							const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10' : '';

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`px-4 py-3 text-center font-semibold text-gray-700 ${sticky} bg-slate-100 ${header.column.getCanSort() ? 'select-none cursor-pointer hover:bg-slate-200 transition-colors' : ''}`}
									onClick={header.column.getToggleSortingHandler()}
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
					<tr key={row.id} className="hover:bg-blue-50 transition-colors">
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

	const TableFooter: React.FC = () => {
		return (
			<tfoot>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id} className="bg-gradient-to-r from-slate-100 to-slate-50">
						{row.getVisibleCells().map((cell, index) => {
							const sticky =
								index === 0
									? 'text-left whitespace-nowrap sticky left-0 z-10 bg-gradient-to-r from-slate-100 to-slate-50'
									: '';

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
		return (
			<Link to={APP_ROUTES.league(leagueSlug)} className="font-semibold">
				{leagueName}
			</Link>
		);
	};

	return {
		table,
		TableHead,
		TableBody,
		TableFooter
	};
};
