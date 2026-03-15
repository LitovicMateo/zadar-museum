import React from 'react';

import NoContent from '@/components/no-content/NoContent';
import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import AnimatedTableWrapper from '@/components/ui/AnimatedTableWrapper';
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
