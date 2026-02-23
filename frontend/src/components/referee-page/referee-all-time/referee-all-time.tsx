import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import Heading from '@/components/ui/heading';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import TableWrapper from '@/components/ui/table-wrapper';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/useRefereeTeamRecord';

import { useRefereeStatsTable } from './useRefereeStatsTable';

const RefereeAllTime: React.FC = () => {
	const { refereeId } = useParams();

	const { data: refereeStats } = useRefereeTeamRecord(refereeId!);

	// All rows except the last (Home / Away) go into the body.
	const bodyStats = useMemo(
		() => refereeStats?.stats.slice(0, -1) ?? [],
		[refereeStats]
	);
	// The last row is the Total aggregate — rendered as a footer.
	const footStats = useMemo(
		() => refereeStats?.stats.slice(-1) ?? [],
		[refereeStats]
	);

	const { table } = useRefereeStatsTable(bodyStats);
	const { table: footTable } = useRefereeStatsTable(footStats);

	if (!refereeStats || refereeStats.stats.length === 0) {
		return <NoContent type="info" description="This referee has no all-time record available." />;
	}

	return (
		<section className="flex flex-col gap-4">
			<Heading title="All Time Record" />

			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</section>
	);
};

export default RefereeAllTime;
