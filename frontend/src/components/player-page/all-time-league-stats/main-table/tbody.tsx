import React from 'react';

import TableCell from '@/components/ui/table-cell';
import { PlayerAllTimeStats } from '@/types/api/player';
import { flexRender, Table } from '@tanstack/react-table';

type TBodyProps = {
	table: Table<PlayerAllTimeStats>;
};

const TBody: React.FC<TBodyProps> = ({ table }) => {
	return (
		<tbody>
			{table.getRowModel().rows.map((row) => (
				<tr key={row.id}>
					{row.getVisibleCells().map((cell, index) => {
						const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10 bg-white' : '';

						return (
							<TableCell key={cell.id} sticky={sticky}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						);
					})}
				</tr>
			))}
		</tbody>
	);
};

export default TBody;
