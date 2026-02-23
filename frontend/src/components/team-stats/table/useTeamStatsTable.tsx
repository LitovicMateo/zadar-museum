import React from 'react';
import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { TeamStatsRanking } from '@/types/api/team';
import {
	CellContext,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

export const useTeamStatsTable = (
	data: TeamStatsRanking[] | undefined,
	sorting: SortingState,
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>
) => {
	const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
		const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

		// If sorting is cleared (empty array), reset to initial state
		if (newSorting.length === 0) {
			setSorting([{ id: 'games', desc: true }]);
		} else {
			setSorting(newSorting);
		}
	};

	const table = useReactTable<TeamStatsRanking>({
		data: data || [],
		columns: [
			{
				id: 'rank',
				header: '#',
				enableSorting: false,
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => <RankCell info={info} />
			},
			{
				header: 'Team',
				accessorKey: 'team_name',
				meta: { sticky: 'left', stickyOffset: '4ch' },
				cell: (info) => (
					<div className="whitespace-nowrap !text-left">
						<Link to={APP_ROUTES.team(info.row.original.team_slug)}>{info.getValue()}</Link>
					</div>
				),
				enableSorting: false
			},
			{
				header: 'G',
				accessorKey: 'games',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'Win %',
				accessorKey: 'win_pct',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'PTS S',
				accessorKey: 'points_scored',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'PTS A',
				accessorKey: 'points_received',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: '+/-',
				accessorKey: 'points_diff',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: handleSortingChange,
		state: { sorting },
		initialState: { sorting: [{ id: 'games', desc: true }] }
	});

	const RankCell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const row = info.row.original as TeamStatsRanking;

		// determine which stat we’re currently sorting by
		const sortKey = sorting[0]?.id ?? 'games';
		const rankKey = `${sortKey}_rank` as keyof TeamStatsRanking;

		// get current and previous ranks safely
		const currentRank = Number(row[rankKey]) || 0;

		return (
			<div className="w-[3ch]">
				<span>{currentRank}</span>
			</div>
		);
	};

	const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const value = info.getValue();

		// if numerical, fixed to 1 decimal place
		if (typeof value === 'number') return <p>{value.toFixed(1)}</p>;

		return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
	};

	return { table };
};
