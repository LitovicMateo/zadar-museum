import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { useLeagueDetails } from '@/hooks/queries/league/useLeagueDetails';
import { CoachStats } from '@/types/api/coach';
import { CellContext, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useCoachSeasonStatsTable = (data: CoachStats[] | undefined) => {
	console.log(data);

	const table = useReactTable({
		data: data || [],
		columns: [
			{
				header: 'League',
				accessorKey: 'league_slug',
				cell: (info) => {
					if (info.getValue() === undefined) return <p>Total</p>;
					return <LeagueCell leagueSlug={info.getValue()} />;
				}
			},
			{
				header: 'G',
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
				header: 'Win %',
				accessorKey: 'win_percentage',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'PTS A',
				accessorKey: 'avg_points_scored',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'PTS D',
				accessorKey: 'avg_points_received',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'PTS D',
				accessorKey: 'avg_points_difference',
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

	const LeagueCell: React.FC<{ leagueSlug?: string }> = ({ leagueSlug }) => {
		const { data: league } = useLeagueDetails(leagueSlug || '');
		if (!leagueSlug) return <p>Total</p>;
		const leagueName = league?.name || '';
		return <Link to={APP_ROUTES.league(leagueSlug)}>{leagueName}</Link>;
	};

	const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const value = info.getValue();

		return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
	};

	return { table, TableHead, TableBody, TableFoot };
};
