import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { PlayerRecords } from '@/types/api/player-stats';
import {
	CellContext,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

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
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => <RankCell info={info} />
			},
			{
				header: 'Player',
				accessorFn: (row) => row.first_name + ' ' + row.last_name,
				meta: { sticky: 'left', stickyOffset: '4ch' },
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
				accessorKey: 'field_goals_percentage',
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
				accessorKey: 'free_throws_percentage',
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

	return { table };
};
