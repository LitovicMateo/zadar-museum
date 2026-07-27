import { Link } from 'react-router-dom';

import '@/components/UI/table/Types';
import { APP_ROUTES } from '@/constants/Routes';
import { TeamBoxscoreResponse } from '@/types/api/Team';
import { formatMakeAttempt, pct } from '@/utils/TableFormatters';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';

export const useTeamStatsTable = (data: TeamBoxscoreResponse[]) => {
	// The rows all belong to one game, so its declared format drives the columns.
	const isHalves = (data ?? [])[0]?.period_format === 'halves';

	const periodColumns: ColumnDef<TeamBoxscoreResponse>[] = isHalves
		? [
				{
					id: 'first_half',
					accessorKey: 'first_half',
					header: '1H',
					cell: (info) => <p>{info.getValue<number | null>()}</p>
				},
				{
					id: 'second_half',
					accessorKey: 'second_half',
					header: '2H',
					cell: (info) => <p>{info.getValue<number | null>()}</p>
				}
			]
		: [
				{
					id: 'first_quarter',
					accessorKey: 'first_quarter',
					header: '1Q',
					cell: (info) => <p>{info.getValue<number | null>()}</p>
				},
				{
					id: 'second_quarter',
					accessorKey: 'second_quarter',
					header: '2Q',
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
				}
			];

	const table = useReactTable<TeamBoxscoreResponse>({
		getCoreRowModel: getCoreRowModel(),
		data: data ?? [],
		columns: [
			{
				id: 'name',
				accessorFn: (row) => row.team_name,
				header: 'team',
				meta: { sticky: 'left', stickyOffset: '0', width: '150px' },
				cell: (info) => (
					<div className="relative flex items-center pr-4">
						<Link
							className="min-w-[100px] whitespace-nowrap"
							to={APP_ROUTES.team(info.row.original.team_slug)}
						>
							{info.getValue()}
						</Link>
						<Link
							to={`${APP_ROUTES.dashboard.teamStats.edit}${info.row.original.document_id}`}
							className="absolute right-0 top-1/2 hidden -translate-x-1 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity hover:text-court group-hover:opacity-100 md:inline-flex"
							aria-label="Edit team stats"
						>
							<Pencil size={14} />
						</Link>
					</div>
				)
			},
			...periodColumns,
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

	return { table };
};
