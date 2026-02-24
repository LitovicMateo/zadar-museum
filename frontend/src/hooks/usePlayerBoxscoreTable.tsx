import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { PlayerBoxscoreResponse } from '@/types/api/player';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

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

const statusOrder = (status: PlayerBoxscoreResponse['status']): number => {
	if (status === 'starter') return 0;
	if (status === 'dnp-cd') return 2;
	return 1; // 'bench' and anything else
};

export const usePlayerBoxscoreTable = (data: PlayerBoxscoreResponse[]) => {
	const table = useReactTable<PlayerBoxscoreResponse>({
		getCoreRowModel: getCoreRowModel<PlayerBoxscoreResponse>(),
		getSortedRowModel: getSortedRowModel<PlayerBoxscoreResponse>(),
		initialState: {
			columnVisibility: { _statusOrder: false },
			sorting: [
				{ id: '_statusOrder', desc: false },
				{ id: 'number', desc: false }
			]
		},
		columns: [
			{
				id: '_statusOrder',
				accessorFn: (row) => statusOrder(row.status),
				header: '',
				enableSorting: true
			},
			{
				id: 'number',
				accessorKey: 'shirt_number',
				header: '#',
				meta: { sticky: 'left', stickyOffset: '0', width: '60px', align: 'center' },
				cell: (info) => <p className="text-center">{info.getValue()}</p>
			},
			{
				id: 'name',
				accessorFn: (row) => {
					const isCaptain = row.captain;
					return row.first_name + ' ' + row.last_name + (isCaptain ? ' (c)' : '');
				},
				header: 'Player',
				meta: { sticky: 'left', stickyOffset: '40px', width: '200px' },
				cell: (info) => {
					return (
						<Link className=" whitespace-nowrap" to={APP_ROUTES.player(info.row.original.player_id)}>
							{info.getValue()}
						</Link>
					);
				}
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
				header: 'MIN',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">DNP</p>;
					}

					return <p>{mmss(info.row.original.minutes, info.row.original.seconds)}</p>;
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
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
				},
				sortingFn: "alphanumeric"
			}
		],
		data: data
	});

	return { table };
};
