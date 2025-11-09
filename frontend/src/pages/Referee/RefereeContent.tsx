import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import RefereeAllTime from '@/components/referee-page/referee-all-time/referee-all-time';
import RefereeGamelog from '@/components/referee-page/referee-gamelog/referee-gamelog';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/useRefereeTeamRecord';

const RefereeContent: React.FC = () => {
	const { refereeId } = useParams();

	const { data: refereeStats } = useRefereeTeamRecord(refereeId!);

	if (!refereeStats) return <NoContent>This referee has not officiated any games yet.</NoContent>;

	return (
		<PageContentWrapper>
			<RefereeAllTime />
			<RefereeGamelog />
		</PageContentWrapper>
	);
};

export default RefereeContent;
