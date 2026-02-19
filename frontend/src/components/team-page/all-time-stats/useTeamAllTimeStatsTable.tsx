import { useMemo } from 'react';

import TableCell from '@/components/ui/table-cell';
import { TeamStats } from '@/types/api/team';
import { CellContext, Table, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// ---------------------------------------------------------------------------
// Module-level sub-components — stable references across renders
// ---------------------------------------------------------------------------

const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
	const value = info.getValue();
	return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
};

export const AllTimeStatsTableHead: React.FC<{ table: Table<TeamStats> }> = ({ table }) => {
	return (
		<thead>
			{table.getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id} className="border-b-2 border-blue-500">
					{headerGroup.headers.map((header, index) => {
						const sticky =
							index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 bg-slate-100' : '';

						return (
							<th
								key={header.id}
								colSpan={header.colSpan}
								onClick={header.column.getToggleSortingHandler()}
								className={`px-4 py-3 whitespace-nowrap text-center font-semibold text-gray-700 bg-slate-100 ${sticky} ${header.column.getCanSort() ? 'cursor-pointer hover:bg-slate-200 transition-colors select-none' : ''}`}
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

export const AllTimeStatsTableBody: React.FC<{ table: Table<TeamStats> }> = ({ table }) => {
	return (
		<tbody>
			{table.getRowModel().rows.map((row) => (
				<tr key={row.id} className="hover:bg-blue-50 transition-colors group">
					{row.getVisibleCells().map((cell, index) => {
						const sticky =
							index === 0
								? 'text-left whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-blue-50'
								: '';

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

export const AllTimeStatsTableFoot: React.FC<{ table: Table<TeamStats> }> = ({ table }) => {
	return (
		<tfoot>
			{table.getRowModel().rows.map((row) => (
				<tr key={row.id} className="bg-slate-100">
					{row.getVisibleCells().map((cell, index) => {
						const sticky =
							index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 bg-slate-100' : '';

						return (
							<td
								key={cell.id}
								className={`px-4 py-3 border-t-2 border-blue-500 font-bold text-center text-gray-800 ${sticky}`}
							>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						);
					})}
				</tr>
			))}
		</tfoot>
	);
};

// ---------------------------------------------------------------------------
// Hook — returns only the table instance; use the named exports above to render
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
