import { useMemo } from 'react';

import '@/components/UI/table/Types';
import { CoachRecordRow } from '@/types/api/Coach';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ro } from 'date-fns/locale';

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

export const useCoachAllTimeStatsTable = (data: CoachRecordRow[], footerData: CoachRecordRow[]) => {
	const filterData = useMemo(() => {
		return data.filter((row) => row.games > 0);
	}, [data]);

	const columns = useMemo(
		() => [
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
				cell: (info: any) =>
					info.row.original.games === 0 ? (
						<div className="min-w-6">
							<p>-</p>
						</div>
					) : (
						renderCell(info.getValue())
					)
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info: any) =>
					info.row.original.games === 0 ? (
						<div className="min-w-6">
							<p>-</p>
						</div>
					) : (
						renderCell(info.getValue())
					)
			},
			{
				header: 'Win %',
				accessorKey: 'win_percentage' as const,
				cell: (info: any) =>
					info.row.original.games === 0 ? (
						<div className="min-w-6">
							<p>-</p>
						</div>
					) : (
						renderCell(info.getValue(), 1)
					)
			},
			{
				header: 'Pts For',
				accessorKey: 'points_scored' as const,
				cell: (info: any) =>
					info.row.original.games === 0 ? (
						<div className="min-w-6">
							<p>-</p>
						</div>
					) : (
						renderCell(info.getValue(), 1)
					)
			},
			{
				header: 'Pts Ag',
				accessorKey: 'points_received' as const,
				cell: (info: any) =>
					info.row.original.games === 0 ? (
						<div className="min-w-6">
							<p>-</p>
						</div>
					) : (
						renderCell(info.getValue(), 1)
					)
			},
			{
				header: 'Pts Diff',
				accessorKey: 'points_difference' as const,
				cell: (info: any) =>
					info.row.original.games === 0 ? (
						<div className="min-w-6">
							<p>-</p>
						</div>
					) : (
						renderCell(info.getValue(), 1)
					)
			}
		],
		[] as any
	);

	const table = useReactTable<CoachRecordRow>({
		data: filterData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	const footerTable = useReactTable<CoachRecordRow>({
		data: footerData,
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	return { table, footerTable } as const;
};
