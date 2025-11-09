import React from 'react';
import { useParams } from 'react-router-dom';

import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';
import { PlayerDB } from '@/pages/Player/Player';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type TableFooterProps = {
	view: 'total' | 'average';
	db: PlayerDB;
};

const TableFooter: React.FC<TableFooterProps> = ({ view, db }) => {
	const { playerId } = useParams();

	const { data, isLoading } = useAllTimeStats(playerId!, db);

	const totalStats = view === 'total' ? data?.total_career_stats : data?.avg_career_stats;

	const table = useReactTable({
		data: totalStats ?? [],
		columns: [
			{
				header: 'League',
				accessorKey: 'league_name',
				cell: () => <p>TOTAL</p>
			},
			{
				header: 'GP',
				accessorKey: 'total_games',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'GS',
				accessorKey: 'total_games_started',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'PTS',
				accessorKey: 'total_points',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'AST',
				accessorKey: 'total_assists',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'REB',
				accessorKey: 'total_rebounds',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'STL',
				accessorKey: 'total_steals',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'BLK',
				accessorKey: 'total_blocks',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'FGM',
				accessorKey: 'total_field_goals_made',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'FGA',
				accessorKey: 'total_field_goals_attempted',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: '3PM',
				accessorKey: 'total_three_pointers_made',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: '3PA',
				accessorKey: 'total_three_pointers_attempted',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'FTM',
				accessorKey: 'total_free_throws_made',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'FTA',
				accessorKey: 'total_free_throws_attempted',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			},
			{
				header: 'EFF',
				accessorKey: 'total_efficiency',
				cell: (info) => <p>{info.getValue<number | null>()}</p>
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	if (isLoading) {
		return <tfoot></tfoot>;
	}

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

export default TableFooter;
