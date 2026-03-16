import React from 'react';
import { useParams } from 'react-router-dom';

import CoachLeagueStats from '@/components/Coach/CoachPage/Content/CoachLeagueStats/CoachLeagueStats';
import CoachGamelog from '@/components/coach-page/coach-gamelog/CoachGamelog';
import NoContent from '@/components/no-content/NoContent';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
import { useCoachLeagueStats } from '@/hooks/queries/coach/UseCoachLeagueStats';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';

const CoachContent: React.FC = React.memo(function CoachContent() {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);
	const { data } = useCoachLeagueStats(coachId!, db!);

	if (!data) return <NoContent type="info" description="This coach did not participate in any games." />;

	return (
		<PageContentWrapper>
			<DynamicContentWrapper>
				<CoachLeagueStats />
				<CoachGamelog />
			</DynamicContentWrapper>
		</PageContentWrapper>
	);
});

export default CoachContent;
