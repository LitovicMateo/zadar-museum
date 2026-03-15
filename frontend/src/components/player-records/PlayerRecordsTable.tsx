import React from 'react';

import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import { PlayerRecords } from '@/types/api/PlayerStats';
import { SortingState } from '@tanstack/react-table';

import NoContent from '../no-content/NoContent';
import AnimatedTableWrapper from '../ui/AnimatedTableWrapper';
import { usePlayerRecordsTable } from './UsePlayerRecordsTable';

type PlayerRecordsTableProps = {
	data: PlayerRecords[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const PlayerRecordsTable: React.FC<PlayerRecordsTableProps> = ({ data, sorting, setSorting }) => {
	const { table } = usePlayerRecordsTable(data, sorting, setSorting);
	if (!data || data.length === 0) {
		return <NoContent type="info" description={<p>There are no player stats in the database.</p>} />;
	}

	return (
		<AnimatedTableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</AnimatedTableWrapper>
	);
};

export default PlayerRecordsTable;
