import React from 'react';
import { useParams } from 'react-router-dom';

import CoachGamelog from '@/components/coach-page/coach-gamelog/coach-gamelog';
import CoachLeagueStats from '@/components/coach-page/coach-league-stats/coach-league-stats';
import NoContent from '@/components/no-content/no-content';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import { useCoachLeagueStats } from '@/hooks/queries/coach/useCoachLeagueStats';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';

const CoachContent: React.FC = () => {
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
};

export default CoachContent;
