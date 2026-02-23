import { useMemo } from 'react';
import '@/components/ui/table/types';
import { CoachRecordRow } from '@/types/api/coach';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

const renderCell = (value: unknown, decimals?: number) => {
	const num = Number(value as any);
	if (Number.isNaN(num))
		return (
			<div className="min-w-6">
				<p>-</p>
			</div>
		);

	return (
		<div className="min-w-6">
			<p>{decimals != null ? num.toFixed(decimals) : num}</p>
		</div>
	);
};

export const useCoachAllTimeStatsTable = (data: CoachRecordRow[] | undefined) => {
	const columns = useMemo(() => [
		{
			header: 'Statistic',
			accessorKey: 'name',
			meta: { sticky: 'left' as const, stickyOffset: '0' }
		},
		{
			header: 'G',
			accessorKey: 'games',
			cell: (info: any) => {
				return info.getValue() === 0 ? (
					<div className="min-w-6">
						<p>-</p>
					</div>
				) : (
					<div className="min-w-6">
						<p>{info.getValue()}</p>
					</div>
				);
			}
		},
		{
			header: 'W',
			accessorKey: 'wins',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className="min-w-6">
					<p>-</p>
				</div>
			) : renderCell(info.getValue()))
		},
		{
			header: 'L',
			accessorKey: 'losses',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className="min-w-6">
					<p>-</p>
				</div>
			) : renderCell(info.getValue()))
		},
		{
			header: 'Win %',
			accessorKey: 'win_percentage',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className="min-w-6">
					<p>-</p>
				</div>
			) : renderCell(info.getValue(), 1))
		},
		{
			header: 'Pts For',
			accessorKey: 'points_scored',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className="min-w-6">
					<p>-</p>
				</div>
			) : renderCell(info.getValue(), 1))
		},
		{
			header: 'Pts Ag',
			accessorKey: 'points_received',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className="min-w-6">
					<p>-</p>
				</div>
			) : renderCell(info.getValue(), 1))
		},
		{
			header: 'Pts Diff',
			accessorKey: 'pointsDiff',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className="min-w-6">
					<p>-</p>
				</div>
			) : renderCell(info.getValue(), 1))
		}
	], [] as any);

	const table = useReactTable<CoachRecordRow>({
		data: data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	return { table } as const;
};
