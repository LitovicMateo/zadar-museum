import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { PlayerBoxscoreResponse } from '@/types/api/player';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

const pct = (v: number | null) => (v === null ? '—' : `${v}%`);
const mmss = (m: number | null, s: number | null) => {
	if (m === null || s === null) return '—';
	const sec = String(s).padStart(2, '0');
	return `${m}:${sec}`;
};

const formatMakeAttempt = (made: number | null, attempted: number | null) => {
	// No made recorded
	if (made === null || made === undefined) return '—';

	// If attempts missing (null/undefined) or attempts === 0 while there are makes > 0,
	// show '-' for attempts per user's request (historical data without attempts).
	const madeNum = Number(made ?? 0);
	const attMissing = attempted === null || attempted === undefined || (Number(attempted) === 0 && madeNum > 0);
	const attDisplay = attMissing ? '-' : String(attempted);
	return `${made}/${attDisplay}`;
};

export const usePlayerBoxscoreTable = (data: PlayerBoxscoreResponse[]) => {
	const table = useReactTable<PlayerBoxscoreResponse>({
		getCoreRowModel: getCoreRowModel<PlayerBoxscoreResponse>(),
		getSortedRowModel: getSortedRowModel<PlayerBoxscoreResponse>(),
		initialState: { sorting: [{ id: 'fg', desc: true }] },
		columns: [
			{
				id: 'number',
				accessorKey: 'shirt_number',
				header: '#',
				cell: (info) => <p className="text-center">{info.getValue()}</p>
			},
			{
				id: 'name',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
				header: 'name',
				cell: (info) => (
					<Link className=" whitespace-nowrap" to={APP_ROUTES.player(info.row.original.player_id)}>
						{info.getValue()}
					</Link>
				)
			},
			{
				id: 'position',
				accessorKey: 'position',
				header: 'POS',
				cell: (info) => {
					const secPos = info.row.original.secondary_position;
					if (secPos) {
						return (
							<p className="text-center uppercase whitespace-nowrap">{info.getValue() + '/' + secPos}</p>
						);
					}
					return <p className="text-center uppercase">{info.getValue()}</p>;
				}
			},
			{
				id: 'time',
				accessorFn: (row) => row.minutes + ':' + row.seconds,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">DNP</p>;
					}

					return <p>{mmss(info.row.original.minutes, info.row.original.seconds)}</p>;
				}
			},
			{
				id: 'pts',
				accessorKey: 'points',
				header: 'PTS',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'fg',
				// accessor returns made shots for sorting; cell renders made/attempt display
				accessorFn: (row) => row.field_goals_made,
				header: 'FG',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return (
						<p>
							{formatMakeAttempt(
								info.row.original.field_goals_made,
								info.row.original.field_goals_attempted
							)}
						</p>
					);
				}
			},
			{
				id: 'fg_per',
				accessorFn: (row) => row.field_goals_percentage,
				header: 'FG %',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{pct(info.getValue<number | null>())}</p>;
				}
			},
			{
				id: 'three_point',
				accessorFn: (row) => row.three_pointers_made,
				header: '3PT',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return (
						<p>
							{formatMakeAttempt(
								info.row.original.three_pointers_made,
								info.row.original.three_pointers_attempted
							)}
						</p>
					);
				}
			},
			{
				id: 'three_per',
				accessorFn: (row) => row.three_point_percentage,
				header: '3PT %',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{pct(info.getValue<number | null>())}</p>;
				}
			},
			{
				id: 'free_throw',
				accessorFn: (row) => row.free_throws_made,
				header: 'FT',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return (
						<p>
							{formatMakeAttempt(
								info.row.original.free_throws_made,
								info.row.original.free_throws_attempted
							)}
						</p>
					);
				}
			},
			{
				id: 'free_throw_per',
				accessorFn: (row) => row.free_throws_percentage,
				header: 'FT %',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
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
					if (info.row.original.status === 'dnp-cd') {
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
					if (info.row.original.status === 'dnp-cd') {
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
					if (info.row.original.status === 'dnp-cd') {
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
					if (info.row.original.status === 'dnp-cd') {
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
					if (info.row.original.status === 'dnp-cd') {
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
					if (info.row.original.status === 'dnp-cd') {
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
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'FLS',
				accessorKey: 'fouls',
				header: 'PF',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'FLS ON',
				accessorKey: 'fouls_on',
				header: 'PF ON',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'plus_minus',
				accessorKey: 'plus_minus',
				header: '+/-',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			},
			{
				id: 'efficiency',
				accessorKey: 'efficiency',
				header: 'EFF',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">-</p>;
					}
					return <p>{info.getValue<number | null>()}</p>;
				}
			}
		],
		data: data
	});

	const TableHead: React.FC = () => {
		return (
			<thead className="bg-gray-50 sticky top-0 z-10 text-xs uppercase">
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b">
						{headerGroup.headers.map((header, idx) => {
							// Decide sticky classes based on index
							let stickyClass = '';
							if (idx === 0) stickyClass = 'sticky left-0 z-10 bg-gray-50 w-[60px]';
							if (idx === 1) stickyClass = 'sticky left-[40px] z-10 bg-gray-50 w-[150px]';

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`px-3 py-2 text-center whitespace-nowrap font-semibold select-none cursor-pointer ${stickyClass}`}
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
					<tr key={row.id} className="border-b">
						{row.getVisibleCells().map((cell, idx) => {
							// Decide sticky classes based on index
							const isStarter = cell.row.original.status === 'starter';
							let stickyClass = '';
							if (idx === 0)
								stickyClass = `sticky left-0 z-10 ${isStarter ? 'bg-slate-100' : 'bg-white'}  w-[60px]`;
							if (idx === 1)
								stickyClass = `sticky left-[40px] z-10 ${isStarter ? 'bg-slate-100' : 'bg-white'}  w-[150px]`;

							if (isStarter) {
								stickyClass += ' bg-slate-100';
							}

							return (
								<td
									className={`px-3 py-2 ${idx === 1 ? 'text-left' : 'text-center'}  ${stickyClass}`}
									key={cell.id}
								>
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
