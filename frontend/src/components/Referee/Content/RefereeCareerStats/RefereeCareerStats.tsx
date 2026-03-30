import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/UseRefereeTeamRecord';

import { useRefereeStatsTable } from './UseRefereeStatsTable';

import styles from './RefereeCareerStats.module.css';

const RefereeCareerStats: React.FC = () => {
	const { refereeId } = useParams();

	const { data: refereeStats } = useRefereeTeamRecord(refereeId!);

	// All rows except the last (Home / Away) go into the body.
	const bodyStats = useMemo(() => refereeStats?.stats.slice(0, -1) ?? [], [refereeStats]);
	// The last row is the Total aggregate — rendered as a footer.
	const footStats = useMemo(() => refereeStats?.stats.slice(-1) ?? [], [refereeStats]);

	const { table } = useRefereeStatsTable(bodyStats);
	const { table: footTable } = useRefereeStatsTable(footStats);

	if (!refereeStats || refereeStats.stats.length === 0) {
		return <NoContent type="info" description="This referee has no all-time record available." />;
	}

	return (
		<section className={styles.section}>
			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</section>
	);
};

export default RefereeCareerStats;
