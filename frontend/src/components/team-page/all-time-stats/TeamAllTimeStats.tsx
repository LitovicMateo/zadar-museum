import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useTeamTotalStats } from '@/hooks/queries/team/useTeamTotalStats';

import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import { useTeamAllTimeStatsTable } from './useTeamAllTimeStatsTable';

const TeamAllTimeStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { data: totalStats } = useTeamTotalStats(teamSlug!);

	const { table } = useTeamAllTimeStatsTable(totalStats?.stats);

	if (!totalStats) return null;

	return (
		<>
			<Heading title="All Time Stats" />
			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
			</TableWrapper>
		</>
	);
};

export default TeamAllTimeStats;
