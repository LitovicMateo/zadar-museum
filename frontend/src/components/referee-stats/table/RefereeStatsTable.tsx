import React from 'react';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/pages/Stats/UI/TableWrapper';
import { RefereeStatsRanking } from '@/types/api/referee';

import { useRefereeStatsTable } from './useRefereeStatsTable';

type RefereeStatsTableProps = {
	stats: RefereeStatsRanking[] | undefined;
};

const RefereeStatsTable: React.FC<RefereeStatsTableProps> = ({ stats }) => {
	const { TableHead, TableBody } = useRefereeStatsTable(stats);

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
