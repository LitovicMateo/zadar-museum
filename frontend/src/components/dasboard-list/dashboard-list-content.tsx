import React from 'react';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type DashboardListContentProps = {
	title: string;
	header: string;
	items?: {
		id: number;
		item: React.ReactElement;
		createdAt: string;
	}[];
	isLoading: boolean;
	isError: boolean;
	errorMessage: string;
};

const DashboardListContent: React.FC<DashboardListContentProps> = ({
	header,
	items,
	isError,
	isLoading,
	errorMessage,
	title
}) => {
	const table = useReactTable({
		data: items ?? [],
		columns: [
			{
				header: header,
				accessorKey: 'item',
				cell: (info) => <>{info.getValue()}</>
			},
			{
				header: 'Created At',
				accessorKey: 'createdAt'
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}
	if (isError) {
		return <p className="text-red-600">{errorMessage}</p>;
	}

	if (!items?.length) {
		return <p className="text-gray-500">No {title.toLowerCase()} found</p>;
	}
	return (
		<table className="w-full">
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								key={header.id}
								colSpan={header.colSpan}
								className="px-4 py-2 text-left bg-gray-50 text-gray-500 text-sm font-medium uppercase tracking-wider"
							>
								{flexRender(header.column.columnDef.header, header.getContext())}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default DashboardListContent;
