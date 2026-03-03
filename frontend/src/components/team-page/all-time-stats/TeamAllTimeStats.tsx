import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useTeamTotalStats } from '@/hooks/queries/team/useTeamTotalStats';

import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import { useTeamAllTimeStatsTable } from './useTeamAllTimeStatsTable';

const TeamAllTimeStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { data: totalStats } = useTeamTotalStats(teamSlug!);

	const { table } = useTeamAllTimeStatsTable(
		totalStats?.stats?.filter((r) => r.key !== 'Total')
	);
	const { table: footTable } = useTeamAllTimeStatsTable(
		totalStats?.stats?.filter((r) => r.key === 'Total')
	);

	if (!totalStats) return null;

	return (
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
			<UniversalTableFooter table={footTable} variant="default" />
		</TableWrapper>
	);
};

export default TeamAllTimeStats;
