import React from 'react';
import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { GameStatsEntry } from '@/types/api/player';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import { useLeagueDetails } from './queries/league/useLeagueDetails';

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

export const usePlayerLeagueStatsTable = (rows: GameStatsEntry[] | undefined) => {
	const table = useReactTable<GameStatsEntry>({
		data: rows || [],
		columns: [
			{
				header: 'League',
				accessorKey: 'league_slug',
				meta: { sticky: 'left', stickyOffset: '0' },
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

	return { table };
};
