import React from 'react';
import { useParams } from 'react-router-dom';

import GameGallery from '@/components/game-page/game-gallery/GameGallery';
import GameReferees from '@/components/game-page/game-referees/GameReferees';
import GameStats from '@/components/game-page/game-stats/GameStats';
import NoContent from '@/components/no-content/NoContent';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
import { useGameBoxscore } from '@/hooks/queries/game/UseGameBoxscore';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { useGameTeamStats } from '@/hooks/queries/game/UseGameTeamStats';

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
