import React from 'react';

import NoContent from '@/components/no-content/NoContent';
import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import AnimatedTableWrapper from '@/components/ui/AnimatedTableWrapper';
import { CoachStatsRanking } from '@/types/api/Coach';
import { SortingState } from '@tanstack/react-table';

import { useCoachStatsTable } from './UseCoachStatsTable';

type CoachStatsTableProps = {
	stats: CoachStatsRanking[] | undefined;
	prev: CoachStatsRanking[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const CoachStatsTable: React.FC<CoachStatsTableProps> = ({ stats, prev, sorting, setSorting }) => {
	const { table } = useCoachStatsTable(stats, prev, sorting, setSorting);
	if (!stats || stats.length === 0) {
		return <NoContent type="info" description={<p>There are no coach stats in the database.</p>} />;
	}

	return (
		<AnimatedTableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</AnimatedTableWrapper>
	);
};

export default CoachStatsTable;
