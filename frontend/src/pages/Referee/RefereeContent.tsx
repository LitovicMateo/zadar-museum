import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import RefereeAllTime from '@/components/referee-page/referee-all-time/referee-all-time';
import RefereeGamelog from '@/components/referee-page/referee-gamelog/referee-gamelog';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import { useRefereeGamelog } from '@/hooks/queries/referee/useRefereeGamelog';

const RefereeContent: React.FC = () => {
	const { refereeId } = useParams();

	const { data } = useRefereeGamelog(refereeId!);

	if (!data) return <NoContent type="info" description="This referee has not officiated any games yet." />;

	return (
		<PageContentWrapper>
			<RefereeAllTime />
			<RefereeGamelog />
		</PageContentWrapper>
	);
};

export default RefereeContent;
