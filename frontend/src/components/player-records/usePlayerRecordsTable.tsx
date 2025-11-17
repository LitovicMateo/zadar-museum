import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { PlayerRecords } from '@/types/api/player-stats';
import {
	CellContext,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

import TableCell from '../ui/table-cell';

const mmss = (m: number | null, s: number | null) => {
	if (m === null || s === null) return '—';
	const sec = String(s).padStart(2, '0');
	return `${m}:${sec}`;
};

export const usePlayerRecordsTable = (
	data: PlayerRecords[] | undefined,
	sorting: SortingState,
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>
) => {
	const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
		const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

		// If sorting is cleared (empty array), reset to initial state
		if (newSorting.length === 0) {
			setSorting([{ id: 'points', desc: true }]);
		} else {
			setSorting(newSorting);
		}
	};

	const table = useReactTable<PlayerRecords>({
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
					<div className="whitespace-nowrap text-left!">
						<Link to={APP_ROUTES.player(info.row.original.player_id)}>{info.getValue()}</Link>
					</div>
				),
				enableSorting: false
			},
			{
				header: 'TEAM',
				accessorKey: 'team_short_name',
				cell: (info) => <div className="whitespace-nowrap text-center">{info.getValue()}</div>,
				enableSorting: false
			},
			{
				header: 'VS.',
				cell: (info) => {
					const team = info.row.original.opponent_team_short_name;
					const isHome = info.row.original.is_home_team;
					const prefix = isHome ? '@' : 'vs.';
					return (
						<Link to={APP_ROUTES.game(info.row.original.game_id)} className="text-center">
							{prefix} {team}
						</Link>
					);
				},
				enableSorting: false
			},
			{
				header: 'POS',
				accessorKey: 'position',
				cell: (info) => {
					return <p className="text-center uppercase whitespace-nowrap">{info.getValue()}</p>;
				},
				enableSorting: false
			},
			{
				id: 'minutes',
				header: 'MIN',
				accessorFn: (row) => row.minutes + ':' + row.seconds,
				cell: (info) => {
					if (info.row.original.status === 'dnp-cd') {
						return <p className="text-gray-600">DNP</p>;
					}

					return <p>{mmss(info.row.original.minutes, info.row.original.seconds)}</p>;
				}
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
				accessorKey: 'offensive_rebounds',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'DEF',
				accessorKey: 'defensive_rebounds',
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
				enableSorting: false
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
				enableSorting: false
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
				enableSorting: false
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
			},
			{
				header: 'TO',
				accessorKey: 'turnovers',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			},
			{
				header: 'EFF',
				accessorKey: 'efficiency',
				cell: (info) => <Cell info={info} />,
				sortingFn: 'alphanumeric',
				sortDescFirst: true
			}
		],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: handleSortingChange,
		state: { sorting },
		initialState: { sorting: [{ id: 'points', desc: true }] }
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
							const cellId = header.column.id as keyof PlayerRecords;
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
							const cellId = cell.column.id as keyof PlayerRecords;

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
		const row = info.row.original as PlayerRecords;

		// determine which stat we’re currently sorting by
		const sortKey = sorting[0]?.id ?? 'points';
		const rankKey = `${sortKey}_rank` as keyof PlayerRecords;

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
		if (typeof value === 'number') return <p>{value}</p>;

		return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
	};

	return { table, TableHead, TableBody };
};
