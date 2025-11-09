import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/useRefereeTeamRecord';

import { useRefereeStatsTable } from './useRefereeStatsTable';

const RefereeAllTime: React.FC = () => {
	const { refereeId } = useParams();

	const { data: refereeStats } = useRefereeTeamRecord(refereeId!);

	const { TableHead, TableBody } = useRefereeStatsTable(refereeStats?.stats);

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
