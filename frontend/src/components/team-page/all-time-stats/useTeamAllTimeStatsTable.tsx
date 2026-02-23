import { useMemo } from 'react';

import '@/components/ui/table/types';
import { TeamStats } from '@/types/api/team';
import { CellContext, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// ---------------------------------------------------------------------------
// Module-level sub-components — stable references across renders
// ---------------------------------------------------------------------------

const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
	const value = info.getValue();
	return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const KEY_ORDER = ['Home', 'Away', 'Neutral', 'Total'];

export const useTeamAllTimeStatsTable = (data: TeamStats[] | undefined) => {
	const normalized = useMemo(
		() =>
			(data || []).slice().sort((a, b) => {
				const ai = KEY_ORDER.indexOf(a.key as string);
				const bi = KEY_ORDER.indexOf(b.key as string);
				return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
			}),
		[data]
	);

	const table = useReactTable<TeamStats>({
		data: normalized,
		columns: [
			{
				header: 'League',
				accessorKey: 'key',
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => <Cell info={info} />,
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
		getCoreRowModel: getCoreRowModel()
	});

	return { table };
};
