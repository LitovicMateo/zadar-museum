import TableCell from '@/components/ui/table-cell';
import { CoachLeagueStatsResponse } from '@/types/api/coach';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useCoachLeagueStatsTable = (data: CoachLeagueStatsResponse[] | undefined) => {
	const table = useReactTable<CoachLeagueStatsResponse>({
		data: data ?? [],
		columns: [
			{
				header: '',
				id: 'league',
				columns: [
					{
						header: 'League',
						accessorKey: 'league_name'
					}
				]
			},
			{
				header: 'Total',
				columns: [
					{
						header: 'GP',
						accessorKey: 'total_games',
						cell: (info) => {
							if (info.getValue() === 0) {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'W',
						accessorKey: 'total_wins',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'L',
						accessorKey: 'total_losses',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: '%',
						accessorKey: 'total_win_pct',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'S',
						accessorKey: 'points_scored',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'A',
						accessorKey: 'points_received',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: '+/-',
						accessorKey: 'pts_diff',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					}
				]
			},
			{
				header: 'Head',
				columns: [
					{
						header: 'GP',
						accessorKey: 'games_head',
						cell: (info) => {
							if (info.getValue() === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'W',
						accessorKey: 'wins_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'L',
						accessorKey: 'losses_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: '%',
						accessorKey: 'win_pct_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'S',
						accessorKey: 'pts_scored_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'A',
						accessorKey: 'pts_received_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: '+/-',
						accessorKey: 'diff_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					}
				]
			},
			{
				header: 'Assistant',
				columns: [
					{
						header: 'GP',
						accessorKey: 'games_assistant',
						cell: (info) => {
							if (info.getValue() === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'W',
						accessorKey: 'wins_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'L',
						accessorKey: 'losses_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: '%',
						accessorKey: 'win_pct_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'S',
						accessorKey: 'pts_scored_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'A',
						accessorKey: 'pts_received_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: '+/-',
						accessorKey: 'avg_diff_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					}
				]
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	const TableHead = () => {
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
									className={`px-4 py-2 text-center ${sticky} bg-slate-50 ${
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

	const TableBody = () => {
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
