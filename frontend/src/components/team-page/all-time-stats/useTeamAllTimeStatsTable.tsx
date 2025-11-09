import TableCell from '@/components/ui/table-cell';
import { TeamStats } from '@/types/api/team';
import { CellContext, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useTeamAllTimeStatsTable = (data: TeamStats[] | undefined) => {
	const table = useReactTable<TeamStats>({
		data: data || [],
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
				accessorKey: 'pts_scored',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'PTS R',
				accessorKey: 'pts_received',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric'
			},
			{
				header: 'Diff',
				accessorKey: 'pts_diff',
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

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b border-slate-400">
						{headerGroup.headers.map((header, index) => {
							const sticky =
								index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 bg-slate-50' : '';

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									onClick={header.column.getToggleSortingHandler()}
									className={`px-4 py-2 whitespace-nowrap text-center bg-slate-50 ${sticky} cursor-pointer ${header.column.getCanSort() ? 'select-none' : ''}`}
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

	const TableFoot = () => {
		return (
			<tfoot>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id}>
						{row.getVisibleCells().map((cell, index) => {
							const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 ' : '';

							return (
								<td
									key={cell.id}
									className={`px-4 py-2 border-t border-slate-400 font-semibold text-center ${sticky} bg-slate-50`}
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

	const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const value = info.getValue();

		return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
	};

	return { table, TableHead, TableBody, TableFoot };
};
