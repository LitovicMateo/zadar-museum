import React from 'react';

import CompetitionList from '@/components/games-page/games-filter/CompetitionList';
import GamesFilter from '@/components/games-page/games-filter/GamesFilter';
import GamesList from '@/components/games-page/games-list/GamesList';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import TeamSeasonStats from './TeamSeasonStats';
import styles from './TeamGames.module.css';

const TeamGames: React.FC = () => {
	const { selectedCompetitions, competitions, toggleCompetition } = useGamesContext();

	return (
		<div className={styles.wrapper}>
			<GamesFilter showCompetitions={false} />
			<TeamSeasonStats />
			<CompetitionList
				competitions={competitions}
				selectedCompetitions={selectedCompetitions}
				toggleCompetition={toggleCompetition}
			/>
			{selectedCompetitions.map((slug) => (
				<GamesList key={slug} competitionSlug={slug} />
			))}
			{selectedCompetitions.length === 0 && (
				<div className={styles.empty}>
					No competitions selected
				</div>
			)}
		</div>
	);
};

export default TeamGames;
