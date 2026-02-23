import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { PlayerAllTimeStats } from '@/types/api/player';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

export const usePlayerSeasonLeagueStatsTable = (data: PlayerAllTimeStats[] | undefined) => {
	const formatNum = (value: unknown, decimals = 1) => {
		if (value === null || value === undefined) return '0';
		const n = Number(value);
		if (!Number.isFinite(n)) return '0';
		return n.toFixed(decimals);
	};

	const table = useReactTable<PlayerAllTimeStats>({
		data: data || [],
		columns: [
			{
				header: 'Player',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => {
					if (info.getValue() == null) return <p>Total</p>;
					const orig = info.row.original as Partial<PlayerAllTimeStats> | undefined;
					const playerId = orig?.player_id;
					if (!playerId) return <>{info.getValue()}</>;
					return <Link to={APP_ROUTES.player(playerId)}>{info.getValue()}</Link>;
				},
				enableSorting: false
			},
			{ header: 'GP', accessorKey: 'games', sortDescFirst: true, cell: (info) => info.getValue() ?? 0 },
			{ header: 'GS', accessorKey: 'games_started', sortDescFirst: true, cell: (info) => info.getValue() ?? 0 },
			{
				header: 'MIN',
				accessorKey: 'minutes',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'PTS',
				accessorKey: 'points',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'AST',
				accessorKey: 'assists',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'REB',
				accessorKey: 'rebounds',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'STL',
				accessorKey: 'steals',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'BLK',
				accessorKey: 'blocks',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'FGM',
				accessorKey: 'field_goals_made',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'FGA',
				accessorKey: 'field_goals_attempted',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'FG%',
				accessorKey: 'field_goal_percentage',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: '3PM',
				accessorKey: 'three_pointers_made',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: '3PA',
				accessorKey: 'three_pointers_attempted',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: '3P%',
				accessorKey: 'three_point_percentage',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'FTM',
				accessorKey: 'free_throws_made',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'FTA',
				accessorKey: 'free_throws_attempted',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'FT%',
				accessorKey: 'free_throw_percentage',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			},
			{
				header: 'EFF',
				accessorKey: 'efficiency',
				cell: (info) => formatNum(info.getValue(), 1),
				sortDescFirst: true
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	return { table };
};
