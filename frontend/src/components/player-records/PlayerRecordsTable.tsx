import React from 'react';

import { PlayerRecords } from '@/types/api/player-stats';
import { SortingState } from '@tanstack/react-table';

import NoContent from '../no-content/no-content';
import TableWrapper from '../ui/table-wrapper';
import { usePlayerRecordsTable } from './usePlayerRecordsTable';

type PlayerRecordsTableProps = {
	data: PlayerRecords[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const PlayerRecordsTable: React.FC<PlayerRecordsTableProps> = ({ data, sorting, setSorting }) => {
	const { TableBody, TableHead } = usePlayerRecordsTable(data, sorting, setSorting);
	if (!data || data.length === 0) {
		return <NoContent type="info" description={<p>There are no player stats in the database.</p>} />;
	}

	return (
		<div className="w-full overflow-x-scroll">
			<TableWrapper>
				<TableHead />
				<TableBody />
			</TableWrapper>
		</div>
	);
};

export default PlayerRecordsTable;
