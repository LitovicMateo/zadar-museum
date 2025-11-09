import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { PlayerBoxscoreResponse } from '@/types/api/player';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

export const usePlayerGamelogTable = (games: PlayerBoxscoreResponse[]) => {
	const table = useReactTable<PlayerBoxscoreResponse>({
		data: games,
		columns: [
			{
				header: 'DATE',
				accessorKey: 'game_date',
				cell: (info) => {
					const day = info.getValue().slice(8, 10);
					const month = info.getValue().slice(5, 7);

					return `${month}/${day}`;
				}
			},
			{
				header: 'VS',
				accessorKey: 'opponent_team_name',
				cell: (info) => {
					const isHome = info.row.original.is_home_team;
					return (
						<Link
							to={APP_ROUTES.game(info.row.original.game_id)}
							className={`py-2 text-left whitespace-nowrap sticky left-0 z-10 font-semibold`}
						>
							{isHome ? '' : '@ '}
							{info.getValue()}
						</Link>
					);
				}
			},
			{
				header: 'LEAGUE',
				accessorKey: 'league_short_name',
				cell: (info) => {
					return <Link to={APP_ROUTES.league(info.row.original.league_slug)}>{info.getValue()}</Link>;
				}
			},
			{
				header: 'AGE',
				accessorKey: 'age_decimal'
			},
			{
				header: 'MIN',
				accessorFn: (row) => {
					const paddedSeconds = String(row.seconds).padStart(2, '0');
					return `${row.minutes}:${paddedSeconds}`;
				},
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return 'DNP';
					}

					return info.getValue();
				},
				invertSorting: true
			},
			{
				header: 'PTS',
				accessorKey: 'points',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: 'FG',
				accessorFn: (row) => row.field_goals_made + '/' + row.field_goals_attempted,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				},
				invertSorting: true
			},
			{
				header: 'FG%',
				accessorKey: 'field_goals_percentage',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: '3P',
				accessorFn: (row) => row.three_pointers_made + '/' + row.three_pointers_attempted,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				},
				invertSorting: true
			},
			{
				header: '3P%',
				accessorKey: 'three_point_percentage',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: 'FT',
				accessorFn: (row) => row.free_throws_made + '/' + row.free_throws_attempted,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				},
				invertSorting: true
			},
			{
				header: 'FT%',
				accessorKey: 'free_throws_percentage',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: 'OFF',
				accessorKey: 'offensive_rebounds',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue() ?? '-';
				}
			},
			{
				header: 'DEF',
				accessorKey: 'defensive_rebounds',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue() ?? '-';
				}
			},
			{
				header: 'REB',
				accessorKey: 'rebounds',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue() ?? '-';
				}
			},
			{
				header: 'AST',
				accessorKey: 'assists',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: 'TO',
				accessorKey: 'turnovers',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: 'STL',
				accessorKey: 'steals',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: 'BLK',
				accessorKey: 'blocks',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: 'PF',
				accessorKey: 'fouls',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: '+/-',
				accessorKey: 'plus_minus',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			},
			{
				header: 'EFF',
				accessorKey: 'efficiency',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return info.getValue();
				}
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b border-slate-400 bg-slate-50">
						{headerGroup.headers.map((header, index) => {
							const sticky = index === 1 ? 'text-left whitespace-nowrap sticky left-0 bg-slate-50' : '';

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`px-4 py-2 text-center ${sticky}`}
									onClick={header.column.getToggleSortingHandler()}
								>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
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
					<tr key={row.id} className="border-b border-slate-400 ">
						{row.getVisibleCells().map((cell, index) => {
							const sticky =
								index === 1 ? 'text-left whitespace-nowrap bg-white sticky left-0 z-10 ' : '';

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

	return {
		table,
		TableHead,
		TableBody
	};
};
