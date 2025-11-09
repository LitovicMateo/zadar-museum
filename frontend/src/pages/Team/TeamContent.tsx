import React from 'react';

import NoContent from '@/components/no-content/no-content';
import TeamAllTimeStats from '@/components/team-page/all-time-stats/TeamAllTimeStats';
import TeamLeagueStats from '@/components/team-page/league-stats/TeamLeagueStats';
import TeamGames from '@/components/team-page/team-games/team-games';
import TeamLeaders from '@/components/team-page/team-leaders/team-leaders';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import { useGamesContext } from '@/hooks/context/useGamesContext';

const TeamContent: React.FC = () => {
	const { schedule } = useGamesContext();

	if (!schedule) return <NoContent>Team has not played any games yet.</NoContent>;

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
