import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { TeamRecord } from '@/types/api/team-stats';
import {
	CellContext,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

import TableCell from '../ui/table-cell';

export const useTeamRecordsTable = (
	database: PlayerDB,
	data: TeamRecord[] | undefined,
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>,
	sorting: SortingState
) => {
	const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
		const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

		// If sorting is cleared (empty array), reset to initial state
		if (newSorting.length === 0) {
			setSorting([{ id: 'score', desc: true }]);
		} else {
			setSorting(newSorting);
		}
	};

	const table = useReactTable<TeamRecord>({
		data: data || [],
		columns: [
			{
				id: 'rank',
				header: '#',
				enableSorting: false,
				cell: (info) => <RankCell info={info} />
			},
			{
				header: database === 'zadar' ? 'VS' : 'Team',
				cell: (info) => {
					let name;
					let slug;

					if (database === 'zadar') {
						name = info.row.original.opponent_team_name;
						slug = info.row.original.opponent_team_slug;
					} else {
						name = info.row.original.team_name;
						slug = info.row.original.team_slug;
					}

					return (
						<Link to={APP_ROUTES.team(slug)} className="whitespace-nowrap !text-left">
							{name}
						</Link>
					);
				},
				enableSorting: false
			},
			{
				header: 'Season',
				accessorKey: 'season',
				enableSorting: false
			},
			{
				header: 'League',
				accessorKey: 'league_name',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'R',
				accessorKey: 'round',
				cell: (info) => <Cell info={info} />,
				sortDescFirst: true
			},
			{
				header: 'PTS S',
				accessorKey: 'score'
			},
			{
				header: 'PTS R',
				accessorKey: 'opponent_score'
			},
			{
				header: 'DIFF',
				accessorKey: 'score_diff'
			},
			{
				header: '1Q',
				accessorKey: 'first_quarter'
			},
			{
				header: '2Q',
				accessorKey: 'second_quarter'
			},
			{
				header: '3Q',
				accessorKey: 'third_quarter'
			},
			{
				header: '4Q',
				accessorKey: 'fourth_quarter'
			},
			{
				header: 'OT',
				accessorKey: 'overtime'
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
				cell: (info) => <Cell info={info} />
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
		initialState: { sorting: [{ id: 'score', desc: true }] }
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
							const cellId = header.column.id as keyof TeamRecord;
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
							const cellId = cell.column.id as keyof TeamRecord;

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
		const row = info.row.original as TeamRecord;

		// determine which stat we’re currently sorting by
		const sortKey = sorting[0]?.id ?? 'points';
		const rankKey = `${sortKey}_rank` as keyof TeamRecord;

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
