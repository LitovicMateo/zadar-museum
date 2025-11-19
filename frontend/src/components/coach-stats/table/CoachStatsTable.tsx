import React from 'react';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/pages/Stats/UI/TableWrapper';
import { CoachStatsRanking } from '@/types/api/coach';
import { SortingState } from '@tanstack/react-table';

import { useCoachStatsTable } from './useCoachStatsTable';

type CoachStatsTableProps = {
	stats: CoachStatsRanking[] | undefined;
	prev: CoachStatsRanking[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const CoachStatsTable: React.FC<CoachStatsTableProps> = ({ stats, prev, sorting, setSorting }) => {
	const { TableBody, TableHead } = useCoachStatsTable(stats, prev, sorting, setSorting);
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
