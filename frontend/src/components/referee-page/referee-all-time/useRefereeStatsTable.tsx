import '@/components/ui/table/types';
import { RefereeStats } from '@/types/api/referee';
import { CellContext, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const Cell = <TData extends object, TValue>({ info }: { info: CellContext<TData, TValue> }) => {
	const value = info.getValue();
	return <p>{value === null || value === undefined ? '-' : String(value)}</p>;
};

export const useRefereeStatsTable = (data: RefereeStats[] | undefined) => {
	const table = useReactTable<RefereeStats>({
		data: data || [],
		columns: [
			{
				header: '',
				accessorKey: 'key',
				meta: { sticky: 'left', stickyOffset: '0' }
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
				header: '%',
				accessorKey: 'win_percentage',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'For',
				accessorKey: 'fouls_for',
				cell: (info) => <Cell info={info} />
			},
			{
				header: 'Ag.',
				accessorKey: 'fouls_against',
				cell: (info) => <Cell info={info} />
			},
			{
				header: '+/-',
				accessorKey: 'foul_difference',
				cell: (info) => <Cell info={info} />
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	return { table };
};
