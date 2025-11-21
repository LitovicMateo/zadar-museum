import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { TeamBoxscoreResponse } from '@/types/api/team';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const pct = (v: number | null) => (v === null ? '—' : `${v}%`);

const formatMakeAttempt = (made: number | null, attempted: number | null) => {
	if (made === null || made === undefined) return '—';
	const madeNum = Number(made ?? 0);
	const attMissing = attempted === null || attempted === undefined || (Number(attempted) === 0 && madeNum > 0);
	const attDisplay = attMissing ? '-' : String(attempted);
	return `${made}/${attDisplay}`;
};

export const useTeamStatsTable = (data: TeamBoxscoreResponse[]) => {
	const table = useReactTable<TeamBoxscoreResponse>({
		getCoreRowModel: getCoreRowModel(),
		data: data ?? [],
		columns: [
			{
				id: 'name',
				accessorFn: (row) => row.team_name,
				header: 'team',
				cell: (info) => (
					<Link
						className=" min-w-[100px] whitespace-nowrap"
						to={APP_ROUTES.team(info.row.original.team_slug)}
					>
						{info.getValue()}
					</Link>
				)
			},
			{
				id: 'first_quarter',
				accessorKey: 'first_quarter',
				header: ({ table }) => {
					// Look at first row to decide if it's halves or quarters
					const sample = table.getRowModel().rows[0]?.original;

					if (sample?.third_quarter == null && sample?.fourth_quarter == null) {
						return '1H'; // halves
					}
					return '1Q'; // quarters
				},
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				id: 'second_quarter',
				accessorKey: 'second_quarter',
				header: ({ table }) => {
					// Look at first row to decide if it's halves or quarters
					const sample = table.getRowModel().rows[0]?.original;

					if (sample?.third_quarter == null && sample?.fourth_quarter == null) {
						return '2H'; // halves
					}
					return '2Q'; // quarters
				},
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				id: 'third_quarter',
				accessorKey: 'third_quarter',
				header: '3Q',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				id: 'fourth_quarter',
				accessorKey: 'fourth_quarter',
				header: '4Q',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				id: 'fg',
				accessorFn: (row) => formatMakeAttempt(row.field_goals_made, row.field_goals_attempted),
				header: 'FG',
				cell: (info) => {
					return <p>{info.getValue<string>()}</p>;
				}
			},
			{
				id: 'fg_per',
				accessorFn: (row) => row.field_goals_percentage,
				header: 'FG %',
				cell: (info) => {
					if (info.row.original.field_goals_attempted === null) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{pct(info.getValue<number | null>())}</p>;
				}
			},
			{
				id: 'three_point',
				accessorFn: (row) => formatMakeAttempt(row.three_pointers_made, row.three_pointers_attempted),
				header: '3PT',
				cell: (info) => {
					return <p>{info.getValue<string>()}</p>;
				}
			},
			{
				id: 'three_per',
				accessorFn: (row) => row.three_pointers_percentage,
				header: '3PT %',
				cell: (info) => {
					if (info.row.original.three_pointers_attempted === null) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{pct(info.getValue<number | null>())}</p>;
				}
			},
			{
				id: 'free_throw',
				accessorFn: (row) => formatMakeAttempt(row.free_throws_made, row.free_throws_attempted),
				header: 'FT',
				cell: (info) => {
					return <p>{info.getValue<string>()}</p>;
				}
			},
			{
				id: 'free_throw_per',
				accessorFn: (row) => row.free_throws_percentage,
				header: 'FT %',
				cell: (info) => {
					if (info.row.original.free_throws_attempted === null) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{pct(info.getValue<number | null>())}</p>;
				}
			},
			{
				id: 'assists',
				accessorKey: 'assists',
				header: 'AST',
				cell: (info) => {
					if (info.row.original.assists === null) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'off_rebounds',
				accessorKey: 'offensive_rebounds',
				header: 'OREB',
				cell: (info) => {
					if (info.row.original.offensive_rebounds === null || info.row.original.offensive_rebounds === 0) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'def_rebounds',
				accessorKey: 'defensive_rebounds',
				header: 'DREB',
				cell: (info) => {
					if (info.row.original.defensive_rebounds === null || info.row.original.defensive_rebounds === 0) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'rebounds',
				accessorKey: 'rebounds',
				header: 'REB',
				cell: (info) => {
					if (info.row.original.rebounds === null || info.row.original.rebounds === 0) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'turnovers',
				accessorKey: 'turnovers',
				header: 'TO',
				cell: (info) => {
					if (info.row.original.turnovers === null) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'steals',
				accessorKey: 'steals',
				header: 'STL',
				cell: (info) => {
					if (info.row.original.steals === null) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'blocks',
				accessorKey: 'blocks',
				header: 'BLK',
				cell: (info) => {
					if (info.row.original.blocks === null) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'fouls',
				accessorKey: 'fouls',
				header: 'FLS',
				cell: (info) => {
					if (info.row.original.fouls === null) {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			}
		]
	});

	const TableHead: React.FC = () => {
		return (
			<thead className="bg-gray-50 sticky top-0 z-10 text-xs uppercase">
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b">
						{headerGroup.headers.map((header, idx) => {
							// Decide sticky classes based on index
							let stickyClass = '';
							if (idx === 0) stickyClass = 'sticky left-0 z-10 bg-gray-50 w-[150px] text-left pl-4';

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`px-3 py-2 text-center whitespace-nowrap font-semibold select-none cursor-pointer ${stickyClass}`}
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
					<tr key={row.id} className="border-b">
						{row.getVisibleCells().map((cell, idx) => {
							// Decide sticky classes based on index
							let stickyClass = '';
							if (idx === 0) stickyClass = `sticky left-0 z-10 text-left bg-white pl-4 w-[60px]`;

							return (
								<td className={`px-3 py-2 text-center whitespace-nowrap  ${stickyClass}`} key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		);
	};

	return { table, TableHead, TableBody };
};
