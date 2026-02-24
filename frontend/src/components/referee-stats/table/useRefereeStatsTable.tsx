import React from 'react';
import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { RefereeStatsRanking } from '@/types/api/referee';
import {
	CellContext,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

export const useRefereeStatsTable = (
	data: RefereeStatsRanking[] | undefined,
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

	const table = useReactTable<RefereeStatsRanking>({
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
				id: 'referee',
				header: 'Referee',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
				meta: { sticky: 'left', stickyOffset: '4ch' },
				cell: (info) => (
					<div className="whitespace-nowrap !text-left">
						<Link to={APP_ROUTES.referee(info.row.original.referee_document_id)}>{info.getValue()}</Link>
					</div>
				),
				enableSorting: false
			},
			{
				id: 'games',
				header: 'G',
				accessorKey: 'games',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />,
				sortingFn: "alphanumeric"
			},
			{
				id: 'wins',
				header: 'W',
				accessorKey: 'wins',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />,
				sortingFn: "alphanumeric"
			},
			{
				id: 'losses',
				header: 'L',
				accessorKey: 'losses',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />,
				sortingFn: "alphanumeric"
			},
			{
				id: 'win_percentage',
				header: '%',
				accessorKey: 'win_percentage',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />,
				sortingFn: "alphanumeric"
			},

			{
				id: 'fouls_for',
				header: 'F',
				accessorKey: 'fouls_for',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />,
				sortingFn: "alphanumeric"
			},
			{
				id: 'fouls_against',
				header: 'A',
				accessorKey: 'fouls_against',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />,
				sortingFn: "alphanumeric"
			},
			{
				id: 'foul_difference',
				header: 'Diff',
				accessorKey: 'foul_difference',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />,
				sortingFn: "alphanumeric"
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: handleSortingChange,
		state: { sorting },
		initialState: { sorting: [{ id: 'wins', desc: true }] }
	});

	const RankCell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const row = info.row.original as RefereeStatsRanking;

		// determine which stat we’re currently sorting by
		const sortKey = sorting[0]?.id ?? 'games';

		const rankKey = `${sortKey}_rank` as keyof RefereeStatsRanking;

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
