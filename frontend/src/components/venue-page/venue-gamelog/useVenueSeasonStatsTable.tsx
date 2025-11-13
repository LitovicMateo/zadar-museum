import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { VenueSeasonStats } from '@/types/api/venue';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useVenueSeasonStatsTable = (seasonStats: VenueSeasonStats[] | undefined) => {
	const table = useReactTable<VenueSeasonStats>({
		data: seasonStats || [],
		columns: [
			{
				header: 'Legaue',
				accessorKey: 'league_name',
				cell: (info) => {
					if (info.getValue() === undefined) return <p>Total</p>;
					const orig = info.row.original as Partial<VenueSeasonStats> | undefined;
					const slug = orig?.league_slug;
					if (!slug) return <span className="font-semibold">{info.getValue()}</span>;
					return (
						<Link to={APP_ROUTES.league(slug)} className="font-semibold">
							{info.getValue()}
						</Link>
					);
				}
			},
			{
				header: 'G',
				accessorKey: 'games',
				cell: (info) => info.getValue() || 0
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => info.getValue() || 0
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => info.getValue() || 0
			},
			{
				header: 'Win %',
				accessorKey: 'win_percentage',
				cell: (info) => info.getValue().toFixed(1) || 0
			},
			{
				header: 'ATT',
				accessorKey: 'avg_attendance',
				cell: (info) => info.getValue().toFixed(1) || 0
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

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`px-4 py-2 text-center whitespace-nowrap ${sticky} bg-slate-50 ${header.column.getCanSort() ? 'select-none cursor-pointer' : ''}`}
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

	return { table, TableHead, TableBody, TableFoot };
};
