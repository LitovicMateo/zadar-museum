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

export const useRefereeStatsTable = (data: RefereeStatsRanking[] | undefined) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
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
				id: 'for',
				header: 'F',
				accessorKey: 'fouls_for',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
			},
			{
				id: 'against',
				header: 'A',
				accessorKey: 'fouls_against',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
			},
			{
				id: 'foul_diff',
				header: 'Diff',
				accessorKey: 'foul_difference',
				sortDescFirst: true,
				cell: (info) => <Cell info={info} />
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: { sorting },
		onSortingChange: setSorting
	});

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b border-slate-400">
						{headerGroup.headers.map((header, index) => {
							const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10' : '';

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`px-4 py-2 text-center whitespace-nowrap ${sticky} bg-slate-50 ${header.column.getCanSort() ? 'select-none cursor-pointer' : ''}`}
									onClick={header.column.getToggleSortingHandler()}
								>
									{flexRender(header.column.columnDef.header, header.getContext())}
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
							const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 bg-white' : '';

							return (
								<TableCell key={cell.id} sticky={sticky}>
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
