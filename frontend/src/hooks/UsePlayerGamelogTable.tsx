import { Link } from 'react-router-dom';

import '@/components/UI/table/Types';
import { APP_ROUTES } from '@/constants/Routes';
import { PlayerBoxscoreResponse } from '@/types/api/Player';
import { displayStat, formatMakeAttempt, mmss, pct } from '@/utils/TableFormatters';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

export const usePlayerGamelogTable = (games: PlayerBoxscoreResponse[] | undefined) => {
	const table = useReactTable<PlayerBoxscoreResponse>({
		data: games || [],
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
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => {
					const isHome = info.row.original.is_home_team;
					return (
						<Link
							to={APP_ROUTES.game(info.row.original.game_id)}
							className="block max-w-[7rem] truncate font-semibold sm:max-w-none"
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
					const slug = info.row.original.league_slug ?? info.row.original.league_id;
					return <Link to={APP_ROUTES.league(String(slug))}>{info.getValue()}</Link>;
				}
			},
			{
				header: 'AGE',
				accessorKey: 'age_decimal'
			},
			{
				header: 'MIN',
				accessorFn: (row) => row.minutes,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return 'DNP';
					}

					return mmss(info.row.original.minutes, info.row.original.seconds);
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
					return displayStat(info.getValue<number | null>());
				}
			},
			{
				header: 'FG',
				accessorFn: (row) => row.field_goals_made,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return formatMakeAttempt(
						info.row.original.field_goals_made,
						info.row.original.field_goals_attempted
					);
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
					return pct(info.getValue<number | null>());
				}
			},
			{
				header: '3P',
				accessorFn: (row) => row.three_pointers_made,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return formatMakeAttempt(
						info.row.original.three_pointers_made,
						info.row.original.three_pointers_attempted
					);
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
					return pct(info.getValue<number | null>());
				}
			},
			{
				header: 'FT',
				accessorFn: (row) => row.free_throws_made,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return formatMakeAttempt(
						info.row.original.free_throws_made,
						info.row.original.free_throws_attempted
					);
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
					return pct(info.getValue<number | null>());
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
					return displayStat(info.getValue<number | null>());
				}
			},
			{
				header: 'TO',
				accessorKey: 'turnovers',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return displayStat(info.getValue<number | null>());
				}
			},
			{
				header: 'STL',
				accessorKey: 'steals',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return displayStat(info.getValue<number | null>());
				}
			},
			{
				header: 'BLK',
				accessorKey: 'blocks',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return displayStat(info.getValue<number | null>());
				}
			},
			{
				header: 'PF',
				accessorKey: 'fouls',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return displayStat(info.getValue<number | null>());
				}
			},
			{
				header: '+/-',
				accessorKey: 'plus_minus',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return displayStat(info.getValue<number | null>());
				}
			},
			{
				header: 'EFF',
				accessorKey: 'efficiency',
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return '-';
					}
					return displayStat(info.getValue<number | null>());
				}
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	return { table };
};
