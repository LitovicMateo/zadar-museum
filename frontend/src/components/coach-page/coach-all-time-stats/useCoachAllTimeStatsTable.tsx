import React, { useMemo } from 'react';
import TableCell from '@/components/ui/table-cell';
import styles from './useCoachAllTimeStatsTable.module.css';
import { CoachRecordRow } from '@/types/api/coach';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, Table } from '@tanstack/react-table';

const renderCell = (value: unknown, decimals?: number) => {
	const num = Number(value as any);
	if (Number.isNaN(num))
		return (
			<div className={styles.minWidth6}>
				<p>-</p>
			</div>
		);

	return (
		<div className={styles.minWidth6}>
			<p>{decimals != null ? num.toFixed(decimals) : num}</p>
		</div>
	);
};

export const useCoachAllTimeStatsTable = (data: CoachRecordRow[] | undefined) => {
	const columns = useMemo(() => [
		{
			header: 'Statistic',
			accessorKey: 'name'
		},
		{
			header: 'G',
			accessorKey: 'games',
			cell: (info: any) => {
				return info.getValue() === 0 ? (
					<div className={styles.minWidth6}>
						<p>-</p>
					</div>
				) : (
					<div className={styles.minWidth6}>
						<p>{info.getValue()}</p>
					</div>
				);
			}
		},
		{
			header: 'W',
			accessorKey: 'wins',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className={styles.minWidth6}>
					<p>-</p>
				</div>
			) : renderCell(info.getValue()))
		},
		{
			header: 'L',
			accessorKey: 'losses',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className={styles.minWidth6}>
					<p>-</p>
				</div>
			) : renderCell(info.getValue()))
		},
		{
			header: 'Win %',
			accessorKey: 'win_percentage',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className={styles.minWidth6}>
					<p>-</p>
				</div>
			) : renderCell(info.getValue(), 1))
		},
		{
			header: 'Pts For',
			accessorKey: 'points_scored',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className={styles.minWidth6}>
					<p>-</p>
				</div>
			) : renderCell(info.getValue(), 1))
		},
		{
			header: 'Pts Ag',
			accessorKey: 'points_received',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className={styles.minWidth6}>
					<p>-</p>
				</div>
			) : renderCell(info.getValue(), 1))
		},
		{
			header: 'Pts Diff',
			accessorKey: 'pointsDiff',
			cell: (info: any) => (info.row.original.games === 0 ? (
				<div className={styles.minWidth6}>
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

export const CoachAllTimeStatsTableHead: React.FC<{ table: Table<CoachRecordRow> }> = ({ table }) => {
	return (
		<thead>
			{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id} className={styles.trBorder}>
					{headerGroup.headers.map((header, index) => {
						const sticky = index === 0 ? styles.stickyLeft : '';

						const isLastInGroup =
							header.column.parent?.columns?.[header.column.parent.columns.length - 1]?.id === header.column.id;

						return (
							<th
								key={header.id}
								colSpan={header.colSpan}
								className={`${styles.thBase} ${sticky} ${styles.bgSlate100} ${styles.hoverBg} ${
									header.column.getCanSort() ? styles.selectNone : ''
								} ${isLastInGroup ? styles.borderRight : ''}`}
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

export const CoachAllTimeStatsTableBody: React.FC<{ table: Table<CoachRecordRow> }> = ({ table }) => {
	return (
		<tbody>
			{table.getRowModel().rows.map((row) => (
				<tr key={row.id}>
					{row.getVisibleCells().map((cell, index) => {
						const sticky = index === 0 ? styles.stickyLeftBody : '';

						const isLastInGroup =
							cell.column.parent?.columns?.[cell.column.parent.columns.length - 1]?.id === cell.column.id;

						return (
							<TableCell key={cell.id} sticky={`${sticky} ${isLastInGroup ? styles.borderRight : ''}`}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						);
					})}
				</tr>
			))}
		</tbody>
	);
};
