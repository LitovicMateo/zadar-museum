import React from 'react';
import { Link } from 'react-router-dom';

import TableCell from '@/components/ui/table-cell';
import { APP_ROUTES } from '@/constants/routes';
import { PlayerAllTimeStats } from '@/types/api/player';
import {
	CellContext,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

export const usePlayerStatsTable = (data: PlayerAllTimeStats[] | undefined, prev: PlayerAllTimeStats[] | undefined) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable<PlayerAllTimeStats>({
		data: data || [],
		columns: [
			{
				id: 'rank',
				header: '#',
				enableSorting: false,
				cell: (info) => <RankCell info={info} />
			},
			{
				header: 'Player',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
				cell: (info) => (
					<div className="whitespace-nowrap !text-left">
						<Link to={APP_ROUTES.player(info.row.original.player_id)}>{info.getValue()}</Link>
					</div>
				),
				enableSorting: false
			},
			{
				header: 'GP',
				accessorKey: 'games',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'GS',
				accessorKey: 'games_started',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'MIN',
				accessorKey: 'minutes',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'PTS',
				accessorKey: 'points',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'AST',
				accessorKey: 'assists',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'OFF',
				accessorKey: 'off_rebounds',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'DEF',
				accessorKey: 'def_rebounds',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'REB',
				accessorKey: 'rebounds',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'FGM',
				accessorKey: 'field_goals_made',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'FGA',
				accessorKey: 'field_goals_attempted',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'FG%',
				accessorKey: 'field_goal_percentage',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: '3PM',
				accessorKey: 'three_pointers_made',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: '3PA',
				accessorKey: 'three_pointers_attempted',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: '3P%',
				accessorKey: 'three_point_percentage',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'FTM',
				accessorKey: 'free_throws_made',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'FTA',
				accessorKey: 'free_throws_attempted',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'FT%',
				accessorKey: 'free_throw_percentage',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'STL',
				accessorKey: 'steals',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'BLK',
				accessorKey: 'blocks',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			}
		],
		state: { sorting },
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting
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

	const RankCell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
		const row = info.row.original as PlayerAllTimeStats;

		const games = row.games;

		if (games === 1) {
			return;
		}

		// get previous row for same player
		const prevObj = prev?.find((obj) => obj.player_id === row.player_id);

		// determine which stat we’re currently sorting by
		const sortKey = sorting[0]?.id ?? 'points';
		const rankKey = `${sortKey}_rank` as keyof PlayerAllTimeStats;

		// get current and previous ranks safely
		const currentRank = Number(row[rankKey]) || 0;
		const previousRank = Number(prevObj?.[rankKey]) || 0;

		// delta: if current rank improved, it’s negative (e.g. 5 → 3 = -2)
		const rankDelta = currentRank - previousRank;

		let arrow = '';
		let color = '';
		if (rankDelta < 0) {
			arrow = '▲'; // moved up in rank
			color = 'text-green-600';
		} else if (rankDelta > 0) {
			arrow = '▼'; // dropped in rank
			color = 'text-red-600';
		}

		if (+games === 1) {
			return (
				<div className="grid grid-cols-[3ch_5ch] gap-1 items-center justify-center">
					<span>{currentRank}</span>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-[3ch_5ch] gap-1 items-center justify-center">
				<span>{currentRank}</span>
				{rankDelta !== 0 && (
					<span className={`text-xs ${color}`}>
						{arrow} {Math.abs(rankDelta)}
					</span>
				)}
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
