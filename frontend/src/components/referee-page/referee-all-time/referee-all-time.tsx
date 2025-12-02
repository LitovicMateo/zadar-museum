import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/useRefereeTeamRecord';

import { useRefereeStatsTable } from './useRefereeStatsTable';

const RefereeAllTime: React.FC = () => {
	const { refereeId } = useParams();

	const { data: refereeStats } = useRefereeTeamRecord(refereeId!);

	const { TableHead, TableBody } = useRefereeStatsTable(refereeStats?.stats);

	if (!refereeStats || refereeStats.stats.length === 0) {
		return <NoContent type="info" description="This referee has no all-time record available." />;
	}

	return (
		<section className="flex flex-col gap-4">
			<Heading title="All Time Record" />

			<TableWrapper>
				<TableHead />
				<TableBody />
			</TableWrapper>
		</section>
	);
};

export default RefereeAllTime;
