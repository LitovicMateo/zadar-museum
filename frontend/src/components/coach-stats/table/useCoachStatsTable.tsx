import React from 'react';
import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { CoachStatsRanking } from '@/types/api/coach';
import {
	CellContext,
	flexRender,
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
				cell: (info) => <RankCell info={info} />
			},
			{
				header: 'Coach',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
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

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b border-slate-400">
						{headerGroup.headers.map((header, index) => {
							const stickyFirst = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10' : '';
							const stickySecond =
								index === 1 ? 'text-left whitespace-nowrap sticky left-[4ch] z-10' : '';
							// get cell id
							const cellId = header.column.id as keyof CoachStatsRanking;
							const isActive = cellId === sorting[0]?.id;

							const arrow = sorting[0]?.desc ? '▼' : '▲';

							const Arrow: React.FC = () => (
								<span className="absolute top-[50%] right-0 transform translate-y-[-50%] text-[10px]">
									{isActive && arrow}
								</span>
							);

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`relative px-4 py-2 text-center whitespace-nowrap ${stickyFirst} ${stickySecond} bg-slate-50 ${header.column.getCanSort() ? 'select-none cursor-pointer' : ''}`}
									onClick={header.column.getToggleSortingHandler()}
								>
									{flexRender(header.column.columnDef.header, header.getContext())}
									<Arrow />
								</th>
							);
						})}
					</tr>
				))}
			</thead>
		);
	};

	const TableBody: React.FC = () => {
		return (
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id}>
						{row.getVisibleCells().map((cell, index) => {
							// get cell id
							const cellId = cell.column.id as keyof CoachStatsRanking;

							const stickyFirst =
								index === 0 ? 'text-left whitespace-nowrap bg-white sticky left-0 z-10' : '';
							const stickySecond =
								index === 1 ? 'text-left whitespace-nowrap bg-white sticky left-[4ch] z-10' : '';
							const highlight = cellId === sorting[0]?.id ? 'bg-slate-100' : '';

							return (
								<TableCell key={cell.id} sticky={`${stickyFirst} ${stickySecond} ${highlight}`}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							);
						})}
					</tr>
				))}
			</tbody>
		);
	};

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

	return { table, TableHead, TableBody };
};
