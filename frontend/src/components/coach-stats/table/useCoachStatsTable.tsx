import React from 'react';
import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { CoachStatsRanking } from '@/types/api/coach';
import {
	CellContext,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

export const useCoachStatsTable = (
	data: CoachStatsRanking[] | undefined,
	prev: CoachStatsRanking[] | undefined,
	sorting: SortingState,
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>
) => {
	const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
		const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

		// If sorting is cleared (empty array), reset to initial state
		if (newSorting.length === 0) {
			setSorting([{ id: 'wins', desc: true }]);
		} else {
			setSorting(newSorting);
		}
	};

	const table = useReactTable<CoachStatsRanking>({
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
				header: 'Coach',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
				meta: { sticky: 'left', stickyOffset: '4ch' },
				cell: (info) => (
					<div className="whitespace-nowrap !text-left">
						<Link to={APP_ROUTES.coach(info.row.original.coach_id)}>{info.getValue()}</Link>
					</div>
				),
				enableSorting: false
			},
			{
				header: 'G',
				accessorKey: 'games',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true,
				sortingFn: "alphanumeric"
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true,
				sortingFn: "alphanumeric"
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'W%',
				accessorKey: 'win_percentage',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'PTS S',
				accessorKey: 'points_scored',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'PTS R',
				accessorKey: 'points_received',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: '+/-',
				accessorKey: 'points_difference',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: handleSortingChange,
		state: { sorting },
		initialState: { sorting: [{ id: 'wins', desc: true }] }
	});

	const RankCell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const row = info.row.original as CoachStatsRanking;

		const games = row.games;

		if (games === 1) {
			return;
		}

		// get previous row for same player
		const prevObj = prev?.find((obj) => obj.coach_id === row.coach_id);

		// determine which stat we’re currently sorting by
		const sortKey = sorting[0]?.id ?? 'games';

		const rankKey = `${sortKey}_rank` as keyof CoachStatsRanking;

		// get current and previous ranks safely
		const currentRank = Number(row[rankKey]) || 0;
		const previousRank = Number(prevObj?.[rankKey]) || 0;

		// delta: if current rank improved, it’s negative (e.g. 5 → 3 = -2)
		const rankDelta = currentRank - previousRank;

		let arrow = '';
		let color = '';
		if (rankDelta < 0) {
			arrow = '▲'; // moved up in rank
			color = 'text-green-600';
		} else if (rankDelta > 0) {
			arrow = '▼'; // dropped in rank
			color = 'text-red-600';
		}

		if (+games === 1) {
			return (
				<div className="grid grid-cols-[3ch_5ch] gap-1 items-center justify-center">
					<span>{currentRank}</span>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-[3ch_5ch] gap-1 items-center justify-center">
				<span>{currentRank}</span>
				{rankDelta !== 0 && (
					<span className={`text-xs ${color}`}>
						{arrow} {Math.abs(rankDelta)}
					</span>
				)}
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
