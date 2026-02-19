import React from 'react';

import TeamAllTimeStats from '@/components/team-page/all-time-stats/TeamAllTimeStats';
import TeamLeagueStats from '@/components/team-page/league-stats/TeamLeagueStats';
import TeamGames from '@/components/team-page/team-games/team-games';
import TeamLeaders from '@/components/team-page/team-leaders/team-leaders';
import PageContentWrapper from '@/components/ui/page-content-wrapper';

const TeamContent: React.FC = () => {
	return (
		<PageContentWrapper>
			<TeamAllTimeStats />
			<TeamLeagueStats />
			<TeamLeaders />
			<TeamGames />
		</PageContentWrapper>
	);
};

export default TeamContent;
