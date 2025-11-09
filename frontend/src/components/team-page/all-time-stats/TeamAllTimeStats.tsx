import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useTeamTotalStats } from '@/hooks/queries/team/useTeamTotalStats';

import { useTeamAllTimeStatsTable } from './useTeamAllTimeStatsTable';

const TeamAllTimeStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { data: totalStats } = useTeamTotalStats(teamSlug!);

	const { TableHead, TableBody } = useTeamAllTimeStatsTable(totalStats?.stats);

	if (!totalStats) return null;

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
		</TableWrapper>
	);
};

export default TeamAllTimeStats;
