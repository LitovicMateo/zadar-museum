import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { TeamRecord } from '@/types/api/team-stats';
import {
	CellContext,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

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
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => <RankCell info={info} />
			},
			{
				header: database === 'zadar' ? 'VS' : 'Team',
				meta: { sticky: 'left', stickyOffset: '4ch' },
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
				accessorKey: 'three_pointers_percentage',
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

	return { table };
};
