import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { PlayerBoxscoreResponse } from '@/types/api/player';
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
							className="py-2 font-semibold"
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

	return { table };
};
