import React from 'react';
import { useParams } from 'react-router-dom';

import GameGallery from '@/components/game-page/game-gallery/game-gallery';
import GameReferees from '@/components/game-page/game-referees/game-referees';
import GameStats from '@/components/game-page/game-stats/game-stats';
import NoContent from '@/components/no-content/no-content';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import { useGameBoxscore } from '@/hooks/queries/game/useGameBoxscore';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { useGameTeamStats } from '@/hooks/queries/game/useGameTeamStats';

const GameContent: React.FC = () => {
	const { gameId } = useParams();

	const { data: game } = useGameDetails(gameId!);

	const { data: teamStats } = useGameTeamStats(gameId!);
	const { data: homeBoxscore } = useGameBoxscore(gameId!, game?.home_team.slug || '');
	const { data: awayBoxscore } = useGameBoxscore(gameId!, game?.away_team.slug || '');

	if (game?.forfeited) {
		if (game.forfeited_by === 'home') {
			return <NoContent type="info" description={`${game.home_team.name} has forfeited the game.`} />;
		}
	}

	if (
		homeBoxscore &&
		awayBoxscore &&
		homeBoxscore.length === 0 &&
		awayBoxscore.length === 0 &&
		teamStats?.length === 0
	)
		return <NoContent type="info" description="There is no boxscore for this game." />;

	return (
		<PageContentWrapper width="1200px">
			{game?.isNulled && <NoContent type="info" description="Results of this game have been nulled." />}
			<GameReferees />
			<GameStats />
			<GameGallery />
		</PageContentWrapper>
	);
};

export default GameContent;
