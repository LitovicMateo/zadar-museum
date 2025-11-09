import TableCell from '@/components/ui/table-cell';
import { CoachRecordRow } from '@/types/api/coach';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

export const useCoachAllTimeStatsTable = (data: CoachRecordRow[] | undefined) => {
	const table = useReactTable<CoachRecordRow>({
		data: data || [],
		columns: [
			{
				header: 'Statistic',
				accessorKey: 'name'
			},
			{
				header: 'G',
				accessorKey: 'games',
				cell: (info) => {
					if (info.getValue() === 0) {
						return (
							<div className="min-w-[24px]">
								<p>-</p>
							</div>
						);
					}

					return (
						<div className="min-w-[24px]">
							<p>{info.getValue()}</p>
						</div>
					);
				}
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => {
					// check total games
					if (info.row.original.games === 0) {
						return (
							<div className="min-w-[24px]">
								<p>-</p>
							</div>
						);
					}

					return (
						<div className="min-w-[24px]">
							<p>{info.getValue()}</p>
						</div>
					);
				}
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => {
					// check total games
					if (info.row.original.games === 0) {
						return (
							<div className="min-w-[24px]">
								<p>-</p>
							</div>
						);
					}

					return (
						<div className="min-w-[24px]">
							<p>{info.getValue()}</p>
						</div>
					);
				}
			},
			{
				header: 'Win %',
				accessorKey: 'winPercentage',
				cell: (info) => {
					if (info.row.original.games === 0) {
						return (
							<div className="min-w-[24px]">
								<p>-</p>
							</div>
						);
					}

					return (
						<div className="min-w-[24px]">
							<p>{info.getValue().toFixed(1)}</p>
						</div>
					);
				}
			},
			{
				header: 'Pts For',
				accessorKey: 'pointsScored',
				cell: (info) => {
					if (info.row.original.games === 0) {
						return (
							<div className="min-w-[24px]">
								<p>-</p>
							</div>
						);
					}

					return (
						<div className="min-w-[24px]">
							<p>{info.getValue().toFixed(1)}</p>
						</div>
					);
				}
			},
			{
				header: 'Pts Ag',
				accessorKey: 'pointsReceived',
				cell: (info) => {
					// check total games
					if (info.row.original.games === 0) {
						return (
							<div className="min-w-[24px]">
								<p>-</p>
							</div>
						);
					}

					return (
						<div className="min-w-[24px]">
							<p>{info.getValue().toFixed(1)}</p>
						</div>
					);
				}
			},
			{
				header: 'Pts Diff',
				accessorKey: 'pointsDiff',
				cell: (info) => {
					// check total games
					if (info.row.original.games === 0) {
						return (
							<div className="min-w-[24px]">
								<p>-</p>
							</div>
						);
					}

					return (
						<div className="min-w-[24px]">
							<p>{info.getValue().toFixed(1)}</p>
						</div>
					);
				}
			}
		],
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
