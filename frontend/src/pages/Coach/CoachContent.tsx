import React from 'react';
import { useParams } from 'react-router-dom';

import CoachGamelog from '@/components/coach-page/coach-gamelog/CoachGamelog';
import CoachLeagueStats from '@/components/coach-page/coach-league-stats/CoachLeagueStats';
import NoContent from '@/components/no-content/NoContent';
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
			<CoachLeagueStats />
			<CoachGamelog />
		</PageContentWrapper>
	);
});

export default CoachContent;
