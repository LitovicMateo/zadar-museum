import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { TeamScheduleResponse } from '@/types/api/team';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useScheduleTable = (schedule: TeamScheduleResponse[]) => {
	const table = useReactTable({
		data: schedule || [],
		columns: [
			{
				id: 'round',
				header: 'R',
				accessorKey: 'round',
				cell: (info) => <p className="px-1 max-w-[2ch]">{info.getValue()}</p>
			},
			{
				id: 'date',
				header: 'Date',
				accessorKey: 'game_date',
				cell: (info) => {
					const date = new Date(info.getValue());
					const top = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
					return (
						<div className="text-xs flex flex-col justify-center items-center max-w-[8ch]">
							<span>{top}</span>
						</div>
					);
				}
			},
			{
				id: 'game',
				header: 'Game',
				accessorFn: (row) => `${row.home_team_name} vs ${row.away_team_name}`,
				cell: (info) => {
					const url = APP_ROUTES.game(info.row.original.game_document_id.toString());
					return (
						<>
							<Link to={url} className="block px-2 min-w-[12ch] sm:hidden">
								{info.row.original.home_team_short_name} vs {info.row.original.away_team_short_name}
							</Link>
							<Link to={url} className="px-2 min-w-[300px] hidden sm:block">
								{info.getValue()}
							</Link>
						</>
					);
				}
			},
			{
				id: 'home_score',
				header: 'H',
				accessorKey: 'home_score',
				cell: (info) => <p className="px-2 text-center max-w-[3ch]">{info.getValue() ?? '-'}</p>
			},
			{
				id: 'away_score',
				header: 'A',
				accessorKey: 'away_score',
				cell: (info) => <p className="px-2 text-center max-w-[3ch]">{info.getValue() ?? '-'}</p>,
				size: 50
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	const Schedule: React.FC = () => {
		if (schedule.length === 0) {
			return <div className="text-center w-full font-abel text-xl text-gray-400">No competitions selected.</div>;
		}

		return (
			<table className="w-full font-abel">
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="border-b w-full">
							{row.getVisibleCells().map((cell) => (
								<td className="py-2 " key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	return { table, Schedule };
};
