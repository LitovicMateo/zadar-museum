import React from 'react';

import NoContent from '@/components/NoContent/NoContent';
import AnimatedTableWrapper from '@/components/UI/AnimatedTableWrapper';
import { UniversalTableBody, UniversalTableHead } from '@/components/UI/table';
import { RefereeStatsRanking } from '@/types/api/Referee';
import { SortingState } from '@tanstack/react-table';

import { useRefereeStatsTable } from './UseRefereeStatsTable';

type RefereeStatsTableProps = {
	stats: RefereeStatsRanking[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const RefereeStatsTable: React.FC<RefereeStatsTableProps> = ({ stats, sorting, setSorting }) => {
	const { table } = useRefereeStatsTable(stats, sorting, setSorting);

	if (stats && stats.length === 0) {
		return <NoContent type="info" description={<p>There are no referee stats in the database.</p>} />;
	}

	return (
		<AnimatedTableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</AnimatedTableWrapper>
	);
};

export default RefereeStatsTable;
