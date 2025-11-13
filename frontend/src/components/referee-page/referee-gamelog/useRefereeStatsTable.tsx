import React from 'react';
import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { useLeagueDetails } from '@/hooks/queries/league/useLeagueDetails';
import { RefereeStats } from '@/types/api/referee';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useRefereeStatsTable = (data: RefereeStats[] | undefined) => {
	const table = useReactTable<RefereeStats>({
		data: data || [],
		columns: [
			{
				header: 'League',
				accessorKey: 'league_slug',
				cell: (info) => <LeagueCell leagueSlug={info.getValue()} />
			},
			{
				header: 'G',
				accessorKey: 'games'
			},
			{
				header: 'W',
				accessorKey: 'wins'
			},
			{
				header: 'L',
				accessorKey: 'losses'
			},
			{
				header: 'Win %',
				accessorKey: 'win_percentage',
				cell: (info) => {
					const raw = info.getValue();
					const num = raw === null || raw === undefined ? null : Number(raw);
					return num === null || Number.isNaN(num) ? '-' : `${num.toFixed(1)}`;
				}
			},
			{
				header: 'For',
				accessorKey: 'fouls_for',
				cell: (info) => {
					const raw = info.getValue();
					const num = raw === null || raw === undefined ? null : Number(raw);
					return num === null || Number.isNaN(num) ? '-' : `${num.toFixed(1)}`;
				}
			},
			{
				header: 'Ag.',
				accessorKey: 'fouls_against',
				cell: (info) => {
					const raw = info.getValue();
					const num = raw === null || raw === undefined ? null : Number(raw);
					return num === null || Number.isNaN(num) ? '-' : `${num.toFixed(1)}`;
				}
			},
			{
				header: '+/-',
				accessorKey: 'foul_difference',
				cell: (info) => {
					const raw = info.getValue();
					const num = raw === null || raw === undefined ? null : Number(raw);
					return num === null || Number.isNaN(num) ? '-' : `${num.toFixed(1)}`;
				}
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

	return { table, TableHead, TableBody, TableFoot };
};
