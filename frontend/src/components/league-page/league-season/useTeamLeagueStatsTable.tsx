import React from 'react';

import TableCell from '@/components/ui/table-cell';
import { TeamStats } from '@/types/api/team';
import { CellContext, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useTeamLeagueStatsTable = (data: TeamStats[] | undefined) => {
	const table = useReactTable<TeamStats>({
		data: data || [],
		columns: [
			{
				header: '',
				accessorKey: 'key'
			},
			{
				header: 'GP',
				accessorKey: 'games',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'W%',
				accessorKey: 'win_percentage',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'PTS S',
				accessorKey: 'points_scored',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'PTS R',
				accessorKey: 'points_received',
				cell: (info) => <Cell info={info} />
			},
			{
				header: '+/-',
				accessorKey: 'points_diff',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'ATT',
				accessorKey: 'attendance',
				cell: (info) => <Cell info={info} />
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b border-slate-400">
						{headerGroup.headers.map((header, index) => {
							const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10' : '';

							// check if this is the last column in its parent group
							const isLastInGroup =
								header.column.parent?.columns?.[header.column.parent.columns.length - 1]?.id ===
								header.column.id;

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`px-4 py-2 text-center whitespace-nowrap ${sticky} bg-slate-50 ${
										header.column.getCanSort() ? 'select-none cursor-pointer' : ''
									} ${isLastInGroup ? 'border-r border-slate-400' : ''}`}
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

							const isLastInGroup =
								cell.column.parent?.columns?.[cell.column.parent.columns.length - 1]?.id ===
								cell.column.id;

							return (
								<TableCell
									key={cell.id}
									sticky={`${sticky} ${isLastInGroup ? 'border-r border-slate-400' : ''}`}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							);
						})}
					</tr>
				))}
			</tbody>
		);
	};

	const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const value = info.getValue();

		return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
	};

	return { table, TableHead, TableBody };
};
