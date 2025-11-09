import React from 'react';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/pages/Stats/UI/TableWrapper';
import { CoachStatsRanking } from '@/types/api/coach';

import { useCoachStatsTable } from './useCoachStatsTable';

type CoachStatsTableProps = {
	stats: CoachStatsRanking[] | undefined;
	prev: CoachStatsRanking[] | undefined;
};

const CoachStatsTable: React.FC<CoachStatsTableProps> = ({ stats, prev }) => {
	const { TableBody, TableHead } = useCoachStatsTable(stats, prev);

	if (!stats || stats.length === 0) {
		return (
			<NoContent>
				<p>There are no coach stats in the database.</p>
			</NoContent>
		);
	}

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
		</TableWrapper>
	);
};

export default CoachStatsTable;
