import React from 'react';

import { PlayerAllTimeStats } from '@/types/api/player';
import { flexRender, Table } from '@tanstack/react-table';

type THeadProps = {
	table: Table<PlayerAllTimeStats>;
};
const THead: React.FC<THeadProps> = ({ table }) => {
	return (
		<thead>
			{table.getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id} className="border-b border-slate-400">
					{headerGroup.headers.map((header, index) => {
						const sticky = index === 0 ? 'text-left whitespace-nowrap sticky left-0 z-10' : '';

						return (
							<th
								key={header.id}
								colSpan={header.colSpan}
								className={`px-4 py-2 text-center ${sticky} bg-slate-50 ${header.column.getCanSort() ? 'select-none cursor-pointer' : ''}`}
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

export default THead;
