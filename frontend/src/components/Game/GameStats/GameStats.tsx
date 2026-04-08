import React from 'react';
import { useParams } from 'react-router-dom';

import { useGameBoxscore } from '@/hooks/queries/game/UseGameBoxscore';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';

import BoxscoreContainer from '../GameBoxscore/BoxscoreContainer';
import TeamStats from '../GameBoxscore/TeamStats';

import styles from './GameStats.module.css';

const GameStats: React.FC = () => {
	const { gameId } = useParams();

	const { data: game, isLoading: isGameLoading } = useGameDetails(gameId!);

	const { data: homeBoxscore, isLoading: homeLoading } = useGameBoxscore(gameId!, game?.home_team.slug || '');
	const { data: awayBoxscore, isLoading: awayLoading } = useGameBoxscore(gameId!, game?.away_team.slug || '');

	const disableStats = homeLoading || awayLoading || (homeBoxscore?.length === 0 && awayBoxscore?.length === 0);

	if (!game || isGameLoading) return <div>Loading...</div>;

	return (
		<section className={styles.section}>
			<TeamStats />
			{!disableStats && (
				<>
					<BoxscoreContainer teamSlug={game.home_team.slug} teamName={game.home_team_name} />
					<BoxscoreContainer teamSlug={game.away_team.slug} teamName={game.away_team_name} />
				</>
			)}
		</section>
	);
};

export default GameStats;
