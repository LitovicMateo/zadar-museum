import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { useTeamTotalStats } from '@/hooks/queries/team/UseTeamTotalStats';

import { useTeamAllTimeStatsTable } from './UseTeamAllTimeStatsTable';

import styles from './TeamAllTimeStats.module.css';

const TeamAllTimeStats: React.FC = () => {
	const { teamSlug } = useParams();
	const { data: totalStats } = useTeamTotalStats(teamSlug!);

	const { table } = useTeamAllTimeStatsTable(totalStats?.stats?.filter((r) => r.key !== 'Total'));
	const { table: footTable } = useTeamAllTimeStatsTable(totalStats?.stats?.filter((r) => r.key === 'Total'));

	if (!totalStats) return null;

	return (
		<section className={styles.container}>
			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="default" />
			</TableWrapper>
		</section>
	);
};

export default TeamAllTimeStats;
