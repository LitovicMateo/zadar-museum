import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import AllTimeLeagueStats from '@/components/player-page/all-time-league-stats/all-time-league-stats';
import AllTimeStats from '@/components/player-page/all-time-stats/all-time-stats';
import CareerHigh from '@/components/player-page/career-high/career-high';
import Menu from '@/components/player-page/menu/menu';
import PlayerBoxscore from '@/components/player-page/player-boxscore/player-boxscore';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';
import { usePlayerProfileDatabase } from '@/hooks/queries/player/usePlayerProfileDatabase';

const PlayerContent: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const data = usePlayerProfileDatabase(playerId!);
	const { data: stats } = useAllTimeStats(playerId!, selectedDatabase!);

	if (stats?.length === 0) {
		return <NoContent type="info" description={<p>This player did not participate in any games.</p>} />;
	}

	return (
		<PageContentWrapper>
			<Menu showMenu={data.enableSwitch} />
			<AllTimeStats />
			<CareerHigh />
			<AllTimeLeagueStats />
			<PlayerBoxscore />
		</PageContentWrapper>
	);
});

PlayerContent.displayName = 'PlayerContent';

export default PlayerContent;
