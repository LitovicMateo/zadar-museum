import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { TeamStats } from '@/types/api/team';
import {
	CellContext,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';

import { useLeagueDetails } from './queries/league/useLeagueDetails';

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

export const useTeamLeagueStatsTable = (data: TeamStats[] | undefined) => {
	
	const table = useReactTable<TeamStats>({
		data: data || [],
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
				header: 'PTS S',
				accessorKey: 'points_scored',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'PTS R',
				accessorKey: 'points_received',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'Diff',
				accessorKey: 'points_diff',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'ATT',
				accessorKey: 'attendance',
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
