import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { useTeamTotalStats } from '@/hooks/queries/team/UseTeamTotalStats';
import { TeamStats } from '@/types/api/Team';

import { useTeamAllTimeStatsTable } from './UseTeamAllTimeStatsTable';

const TeamAllTimeStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { data: totalStats } = useTeamTotalStats(teamSlug!);

	const { table } = useTeamAllTimeStatsTable(
		totalStats?.stats?.filter((r): r is TeamStats => !!r && r.key !== 'Total')
	);
	const { table: footTable } = useTeamAllTimeStatsTable(
		totalStats?.stats?.filter((r): r is TeamStats => !!r && r.key === 'Total')
	);

	if (!totalStats) {
		return <NoContent type="info" description="No games have been played by this team yet." />;
	}

	return (
		<section>
			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="default" />
			</TableWrapper>
		</section>
	);
};

export default TeamAllTimeStats;
