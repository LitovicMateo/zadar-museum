import React from 'react';
import { useParams } from 'react-router-dom';

import LeagueAllTime from '@/components/league-page/all-time/LeagueAllTime';
import PlayerRankings from '@/components/league-page/player-rankings/PlayerRankings';
import NoContent from '@/components/no-content/NoContent';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
import SeasonData from '@/components/venue-page/season-data/SeasonData';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';

const LeagueContent: React.FC = () => {
	const { leagueSlug } = useParams();

	const { data: leagueSeasons } = useLeagueSeasons(leagueSlug!);

	if (leagueSeasons && leagueSeasons.length === 0)
		return <NoContent type="info" description="No games have been played in this competition." />;

	return (
		<PageContentWrapper>
			<LeagueAllTime />
			<PlayerRankings />
			<SeasonData />
		</PageContentWrapper>
	);
};

export default LeagueContent;
