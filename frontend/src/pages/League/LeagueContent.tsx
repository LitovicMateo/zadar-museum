import React from 'react';
import { useParams } from 'react-router-dom';

import LeagueAllTime from '@/components/league-page/all-time/league-all-time';
import PlayerRankings from '@/components/league-page/player-rankings/player-rankings';
import NoContent from '@/components/no-content/no-content';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import SeasonData from '@/components/venue-page/season-data/season-data';
import { useLeagueSeasons } from '@/hooks/queries/league/useLeagueSeasons';

const LeagueContent: React.FC = () => {
	const { leagueSlug } = useParams();

	const { data: leagueSeasons } = useLeagueSeasons(leagueSlug!);

	if (leagueSeasons && leagueSeasons.length === 0)
		return <NoContent>No games have been played in this competition.</NoContent>;

	return (
		<PageContentWrapper>
			<LeagueAllTime />
			<PlayerRankings />
			<SeasonData />
		</PageContentWrapper>
	);
};

export default LeagueContent;
