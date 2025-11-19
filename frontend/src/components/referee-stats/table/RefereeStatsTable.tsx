import React from 'react';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/pages/Stats/UI/TableWrapper';
import { RefereeStatsRanking } from '@/types/api/referee';
import { SortingState } from '@tanstack/react-table';

import { useRefereeStatsTable } from './useRefereeStatsTable';

type RefereeStatsTableProps = {
	stats: RefereeStatsRanking[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const RefereeStatsTable: React.FC<RefereeStatsTableProps> = ({ stats, sorting, setSorting }) => {
	const { TableHead, TableBody } = useRefereeStatsTable(stats, sorting, setSorting);

	if (stats && stats.length === 0) {
		return (
			<NoContent>
				<p>There are no referee stats in the database.</p>
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

export default RefereeStatsTable;
