import React from 'react';
import { Link } from 'react-router-dom';

import '@/components/ui/table/Types';
import { APP_ROUTES } from '@/constants/Routes';
import { RefereeStats } from '@/types/api/Referee';
import { CellContext, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import { useLeagueDetails } from './queries/league/UseLeagueDetails';

// ---------------------------------------------------------------------------
// Module-level sub-components — stable references across renders
// ---------------------------------------------------------------------------

const LeagueCell: React.FC<{ leagueSlug?: string }> = ({ leagueSlug }) => {
	const { data: league } = useLeagueDetails(leagueSlug || '');
	if (!leagueSlug) return <p>Total</p>;
	const leagueName = league?.name || '';
	return <Link to={APP_ROUTES.league(leagueSlug)}>{leagueName}</Link>;
};

const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
	const value = info.getValue();
	return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useRefereeLeagueStatsTable = (data: RefereeStats[] | undefined) => {
	const filteredRows = React.useMemo(() => {
		if (!data) return [];
		return data.filter((row) => row.games !== null);
	}, [data]);

	const table = useReactTable<RefereeStats>({
		data: filteredRows,
		columns: [
			{
				header: 'League',
				accessorKey: 'league_slug',
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => <LeagueCell leagueSlug={info.getValue()} />,
				enableSorting: false
			},
			{
				header: 'GP',
				accessorKey: 'games',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'W%',
				accessorKey: 'win_percentage',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'FLS',
				accessorKey: 'fouls_for',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'FLA',
				accessorKey: 'fouls_against',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'Diff',
				accessorKey: 'foul_difference',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		initialState: { sorting: [{ id: 'games', desc: true }] }
	});

	return { table };
};
