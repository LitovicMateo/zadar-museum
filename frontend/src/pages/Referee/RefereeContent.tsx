import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/NoContent';
import RefereeAllTime from '@/components/referee-page/referee-all-time/RefereeAllTime';
import RefereeGamelog from '@/components/referee-page/referee-gamelog/RefereeGamelog';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
import { useRefereeGamelog } from '@/hooks/queries/referee/UseRefereeGamelog';

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
