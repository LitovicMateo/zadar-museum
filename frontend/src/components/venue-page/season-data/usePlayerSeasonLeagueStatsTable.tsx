import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { PlayerAllTimeStats } from '@/types/api/player';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

export const usePlayerSeasonLeagueStatsTable = (data: PlayerAllTimeStats[] | undefined) => {
	const table = useReactTable<PlayerAllTimeStats>({
		data: data || [],
		columns: [
			{
				header: 'Player',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
				cell: (info) => {
					if (info.getValue() === undefined) return <p>Total</p>;
					const orig = info.row.original as Partial<PlayerAllTimeStats> | undefined;
					const slug = orig?.league_slug;
					if (!slug) return <>{info.getValue()}</>;
					return <Link to={APP_ROUTES.league(slug)}>{info.getValue()}</Link>;
				},
				enableSorting: false
			},
			{ header: 'GP', accessorKey: 'games', sortDescFirst: true },
			{ header: 'GS', accessorKey: 'games_started', sortDescFirst: true },
			{
				header: 'MIN',
				accessorKey: 'minutes',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'PTS',
				accessorKey: 'points',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'AST',
				accessorKey: 'assists',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'REB',
				accessorKey: 'rebounds',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'STL',
				accessorKey: 'steals',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'BLK',
				accessorKey: 'blocks',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'FGM',
				accessorKey: 'field_goals_made',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'FGA',
				accessorKey: 'field_goals_attempted',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'FG%',
				accessorKey: 'field_goal_percentage',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: '3PM',
				accessorKey: 'three_pointers_made',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: '3PA',
				accessorKey: 'three_pointers_attempted',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: '3P%',
				accessorKey: 'three_point_percentage',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'FTM',
				accessorKey: 'free_throws_made',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'FTA',
				accessorKey: 'free_throws_attempted',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'FT%',
				accessorKey: 'free_throw_percentage',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			},
			{
				header: 'EFF',
				accessorKey: 'efficiency',
				cell: (info) => info.getValue().toFixed(1) || 0,
				sortDescFirst: true
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b border-slate-400">
						{headerGroup.headers.map((header, index) => {
							const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10' : '';

							// check if this is the last column in its parent group
							const isLastInGroup =
								header.column.parent?.columns?.[header.column.parent.columns.length - 1]?.id ===
								header.column.id;

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`px-4 py-2 text-center whitespace-nowrap ${sticky} bg-slate-50 ${
										header.column.getCanSort() ? 'select-none cursor-pointer' : ''
									} ${isLastInGroup ? 'border-r border-slate-400' : ''}`}
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
					<tr key={row.id}>
						{row.getVisibleCells().map((cell, index) => {
							const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 bg-white' : '';

							const isLastInGroup =
								cell.column.parent?.columns?.[cell.column.parent.columns.length - 1]?.id ===
								cell.column.id;

							return (
								<TableCell
									key={cell.id}
									sticky={`${sticky} ${isLastInGroup ? 'border-r border-slate-400' : ''}`}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							);
						})}
					</tr>
				))}
			</tbody>
		);
	};

	return { table, TableHead, TableBody };
};
