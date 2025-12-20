import React from 'react';

import TableCell from '@/components/ui/table-cell';
import { CoachRecordRow } from '@/types/api/coach';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

export const useCoachAllTimeStatsTable = (data: CoachRecordRow[] | undefined) => {
	const columns = React.useMemo(
		() => [
			{
				header: 'Statistic',
				accessorKey: 'name'
			},
			{
				header: 'G',
				accessorKey: 'games',
				cell: (info: any) => {
					const value = info.getValue();
					if (!value && value !== 0) return <div className="min-w-6">-</div>;
					if (Number(value) === 0)
						return (
							<div className="min-w-6">
								<p>-</p>
							</div>
						);
					return (
						<div className="min-w-6">
							<p>{value}</p>
						</div>
					);
				}
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info: any) => {
					if (info.row.original.games === 0)
						return (
							<div className="min-w-6">
								<p>-</p>
							</div>
						);
					return (
						<div className="min-w-6">
							<p>{info.getValue()}</p>
						</div>
					);
				}
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info: any) => {
					if (info.row.original.games === 0)
						return (
							<div className="min-w-6">
								<p>-</p>
							</div>
						);
					return (
						<div className="min-w-6">
							<p>{info.getValue()}</p>
						</div>
					);
				}
			},
			{
				header: 'Win %',
				accessorKey: 'win_percentage',
				cell: (info: any) => {
					if (info.row.original.games === 0)
						return (
							<div className="min-w-6">
								<p>-</p>
							</div>
						);
					const v = info.getValue();
					return (
						<div className="min-w-6">
							<p>{typeof v === 'number' ? v.toFixed(1) : v}</p>
						</div>
					);
				}
			},
			{
				header: 'Pts For',
				accessorKey: 'points_scored',
				cell: (info: any) => {
					if (info.row.original.games === 0)
						return (
							<div className="min-w-6">
								<p>-</p>
							</div>
						);
					const v = info.getValue();
					return (
						<div className="min-w-6">
							<p>{typeof v === 'number' ? v.toFixed(1) : v}</p>
						</div>
					);
				}
			},
			{
				header: 'Pts Ag',
				accessorKey: 'points_received',
				cell: (info: any) => {
					if (info.row.original.games === 0)
						return (
							<div className="min-w-6">
								<p>-</p>
							</div>
						);
					const v = info.getValue();
					return (
						<div className="min-w-6">
							<p>{typeof v === 'number' ? v.toFixed(1) : v}</p>
						</div>
					);
				}
			},
			{
				header: 'Pts Diff',
				accessorKey: 'pointsDiff',
				cell: (info: any) => {
					if (info.row.original.games === 0)
						return (
							<div className="min-w-6">
								<p>-</p>
							</div>
						);
					const v = info.getValue();
					return (
						<div className="min-w-6">
							<p>{typeof v === 'number' ? v.toFixed(1) : v}</p>
						</div>
					);
				}
			}
		],
		[]
	);

	const table = useReactTable<CoachRecordRow>({
		data: data || [],
		columns: columns as any,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
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

	return { table, TableHead, TableBody };
};
