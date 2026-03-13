import React from 'react';

import { PlayerAllTimeStats } from '@/types/api/Player';
import { flexRender, Table } from '@tanstack/react-table';
import styles from '@/components/player-page/all-time-league-stats/main-table/Thead.module.css';

type THeadProps = {
	table: Table<PlayerAllTimeStats>;
};
const THead: React.FC<THeadProps> = ({ table }) => {
	return (
		<thead>
			{table.getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id} className={styles.borderRow}>
					{headerGroup.headers.map((header, index) => {
						const sticky = index === 0 ? styles.thSticky : '';

						return (
							<th
								key={header.id}
								colSpan={header.colSpan}
								className={`${styles.th} ${sticky} ${header.column.getCanSort() ? styles.thSortable : ''}`}
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
