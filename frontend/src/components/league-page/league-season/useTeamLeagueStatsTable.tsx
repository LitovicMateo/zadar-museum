import '@/components/ui/table/types';
import { TeamStats } from '@/types/api/team';
import { CellContext, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
	const value = info.getValue();
	return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
};

export const useTeamLeagueStatsTable = (data: TeamStats[] | undefined) => {
	const table = useReactTable<TeamStats>({
		data: data || [],
		columns: [
			{
				header: '',
				accessorKey: 'key',
				meta: { sticky: 'left', stickyOffset: '0' }
			},
			{
				header: 'GP',
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
				header: 'W%',
				accessorKey: 'win_percentage',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'PTS S',
				accessorKey: 'points_scored',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'PTS R',
				accessorKey: 'points_received',
				cell: (info) => <Cell info={info} />
			},
			{
				header: '+/-',
				accessorKey: 'points_diff',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'ATT',
				accessorKey: 'attendance',
				cell: (info) => <Cell info={info} />
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	return { table };
};
