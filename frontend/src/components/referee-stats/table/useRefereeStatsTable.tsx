import React from 'react';
import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { RefereeStatsRanking } from '@/types/api/referee';
import {
	CellContext,
	flexRender,
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

	console.log(data);

	const table = useReactTable<RefereeStatsRanking>({
		data: data || [],
		columns: [
			{
				id: 'rank',
				header: '#',
				enableSorting: false,
				cell: (info) => <RankCell info={info} />
			},
			{
				id: 'referee',
				header: 'Referee',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
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
				cell: (info) => <Cell info={info} />
			},
			{
				id: 'wins',
				header: 'W',
				accessorKey: 'wins',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
			},
			{
				id: 'losses',
				header: 'L',
				accessorKey: 'losses',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
			},
			{
				id: 'win_percentage',
				header: '%',
				accessorKey: 'win_percentage',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
			},

			{
				id: 'fouls_for',
				header: 'F',
				accessorKey: 'fouls_for',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
			},
			{
				id: 'fouls_against',
				header: 'A',
				accessorKey: 'fouls_against',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
			},
			{
				id: 'foul_difference',
				header: 'Diff',
				accessorKey: 'foul_difference',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
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
							const cellId = header.column.id as keyof RefereeStatsRanking;
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
							const cellId = cell.column.id as keyof RefereeStatsRanking;

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

	return { table, TableHead, TableBody };
};
