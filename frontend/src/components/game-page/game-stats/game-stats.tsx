import React from 'react';
import { useParams } from 'react-router-dom';

import BoxscoreContainer from '@/components/game-page/boxscore/boxscore-container';
import TeamStatsBoxscore from '@/components/game-page/boxscore/team-stats';
import Heading from '@/components/ui/heading';
import { useGameBoxscore } from '@/hooks/queries/game/useGameBoxscore';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';

const GameStats: React.FC = () => {
	const { gameId } = useParams();

	const { data: game, isLoading: isGameLoading } = useGameDetails(gameId!);

	const { data: homeBoxscore, isLoading: homeLoading } = useGameBoxscore(gameId!, game?.home_team.slug || '');
	const { data: awayBoxscore, isLoading: awayLoading } = useGameBoxscore(gameId!, game?.away_team.slug || '');

	const disableStats = homeLoading || awayLoading || (homeBoxscore?.length === 0 && awayBoxscore?.length === 0);

	if (!game || isGameLoading) return <div>Loading...</div>;

	return (
		<section className="flex flex-col gap-4">
			<TeamStatsBoxscore />
			{!disableStats && (
				<div className="flex flex-col gap-2">
					<Heading title="Boxscore" />
					<BoxscoreContainer teamSlug={game.home_team.slug} />
					<BoxscoreContainer teamSlug={game.away_team.slug} />
				</div>
			)}
		</section>
	);
};

export default GameStats;
