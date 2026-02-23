import React from 'react';
import { useParams } from 'react-router-dom';

import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';
import { PlayerDB } from '@/pages/Player/Player';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type TableFooterProps = {
	view: 'total' | 'average';
	db: PlayerDB;
	location?: 'total' | 'home' | 'away' | 'neutral';
};

const TableFooter: React.FC<TableFooterProps> = ({ view, db, location = 'total' }) => {
	const { playerId } = useParams();

	const { data, isLoading } = useAllTimeStats(playerId!, db);

	// API returns PlayerCareerStats[] (per league). Map it into the shape expected by this footer table
	type TotalRow = {
		league_name: string;
		total_games: number | null;
		total_games_started: number | null;
		total_points: number | null;
		total_assists: number | null;
		total_rebounds: number | null;
		total_steals: number | null;
		total_blocks: number | null;
		total_field_goals_made: number | null;
		total_field_goals_attempted: number | null;
		total_three_pointers_made: number | null;
		total_three_pointers_attempted: number | null;
		total_free_throws_made: number | null;
		total_free_throws_attempted: number | null;
		total_efficiency: number | null;
	};

	const totalStats: TotalRow[] | undefined = ((): TotalRow[] | undefined => {
		if (!data) return undefined;
		return data.map((d) => {
			const viewGroup = view === 'total' ? d.total : d.average;
			const chosen = viewGroup?.[location] ?? viewGroup?.total;

			const leagueName = (chosen as unknown as { league_name?: string })?.league_name ?? 'TOTAL';

			return {
				league_name: leagueName,
				total_games: chosen?.games ?? null,
				total_games_started: chosen?.games_started ?? null,
				total_points: chosen?.points ?? null,
				total_assists: chosen?.assists ?? null,
				total_rebounds: chosen?.rebounds ?? null,
				total_steals: chosen?.steals ?? null,
				total_blocks: chosen?.blocks ?? null,
				total_field_goals_made: chosen?.field_goals_made ?? null,
				total_field_goals_attempted: chosen?.field_goals_attempted ?? null,
				total_three_pointers_made: chosen?.three_pointers_made ?? null,
				total_three_pointers_attempted: chosen?.three_pointers_attempted ?? null,
				total_free_throws_made: chosen?.free_throws_made ?? null,
				total_free_throws_attempted: chosen?.free_throws_attempted ?? null,
				total_efficiency: chosen?.efficiency ?? null
			} as TotalRow;
		});
	})();

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
