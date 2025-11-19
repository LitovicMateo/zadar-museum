import React from 'react';
import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { TeamStatsRanking } from '@/types/api/team';
import {
	CellContext,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

export const useTeamStatsTable = (
	data: TeamStatsRanking[] | undefined,
	sorting: SortingState,
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>
) => {
	const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
		const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

		// If sorting is cleared (empty array), reset to initial state
		if (newSorting.length === 0) {
			setSorting([{ id: 'games', desc: true }]);
		} else {
			setSorting(newSorting);
		}
	};

	const table = useReactTable<TeamStatsRanking>({
		data: data || [],
		columns: [
			{
				id: 'rank',
				header: '#',
				enableSorting: false,
				cell: (info) => <RankCell info={info} />
			},
			{
				header: 'Team',
				accessorKey: 'team_name',
				cell: (info) => (
					<div className="whitespace-nowrap !text-left">
						<Link to={APP_ROUTES.team(info.row.original.team_slug)}>{info.getValue()}</Link>
					</div>
				),
				enableSorting: false
			},
			{
				header: 'G',
				accessorKey: 'games',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'Win %',
				accessorKey: 'win_pct',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'PTS S',
				accessorKey: 'points_scored',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'PTS A',
				accessorKey: 'points_received',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: '+/-',
				accessorKey: 'points_diff',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: handleSortingChange,
		state: { sorting },
		initialState: { sorting: [{ id: 'games', desc: true }] }
	});

	const TableHead: React.FC = () => {
		return (
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className="border-b border-slate-400">
						{headerGroup.headers.map((header, index) => {
							const stickyFirst = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10' : '';
							const stickySecond =
								index === 1 ? 'text-left whitespace-nowrap sticky left-[4ch] z-10' : '';
							// get cell id
							const cellId = header.column.id as keyof TeamStatsRanking;
							const isActive = cellId === sorting[0]?.id;

							const arrow = sorting[0]?.desc ? '▼' : '▲';

							const Arrow: React.FC = () => (
								<span className="absolute top-[50%] right-0 transform translate-y-[-50%] text-[10px]">
									{isActive && arrow}
								</span>
							);

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									className={`relative px-4 py-2 text-center whitespace-nowrap ${stickyFirst} ${stickySecond} bg-slate-50 ${header.column.getCanSort() ? 'select-none cursor-pointer' : ''}`}
									onClick={header.column.getToggleSortingHandler()}
								>
									{flexRender(header.column.columnDef.header, header.getContext())}
									<Arrow />
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
							// get cell id
							const cellId = cell.column.id as keyof TeamStatsRanking;

							const stickyFirst =
								index === 0 ? 'text-left whitespace-nowrap bg-white sticky left-0 z-10' : '';
							const stickySecond =
								index === 1 ? 'text-left whitespace-nowrap bg-white sticky left-[4ch] z-10' : '';
							const highlight = cellId === sorting[0]?.id ? 'bg-slate-100' : '';

							return (
								<TableCell key={cell.id} sticky={`${stickyFirst} ${stickySecond} ${highlight}`}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							);
						})}
					</tr>
				))}
			</tbody>
		);
	};

	const RankCell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const row = info.row.original as TeamStatsRanking;

		// determine which stat we’re currently sorting by
		const sortKey = sorting[0]?.id ?? 'games';
		const rankKey = `${sortKey}_rank` as keyof TeamStatsRanking;

		// get current and previous ranks safely
		const currentRank = Number(row[rankKey]) || 0;

		return (
			<div className="w-[3ch]">
				<span>{currentRank}</span>
			</div>
		);
	};

	const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const value = info.getValue();

		// if numerical, fixed to 1 decimal place
		if (typeof value === 'number') return <p>{value.toFixed(1)}</p>;

		return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
	};

	return { table, TableHead, TableBody };
};
