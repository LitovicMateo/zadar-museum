import React from 'react';

import CompetitionList from '@/components/Games/GamesFilter/CompetitionList';
import RightControls from '@/components/Games/GamesFilter/RightControls';
import GamesList from '@/components/Games/GamesList/GamesList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import styles from './TeamGamelog.module.css';

const TeamGamelog: React.FC = () => {
	const {
		selectedCompetitions,
		competitions,
		toggleCompetition,
		seasons,
		selectedSeason,
		setSelectedSeason,
		scheduleLoading
	} = useGamesContext();
	return (
		<div className={styles.wrapper}>
			<div className={styles.gamelogControls}>
				{scheduleLoading || !seasons ? (
					<span className={styles.loadingText}>Loading...</span>
				) : (
					<>
						<div className={styles.gamelogSeasonSelect}>
							<RightControls
								seasons={seasons}
								selectedSeason={selectedSeason}
								onSeasonChange={setSelectedSeason}
								compact
							/>
						</div>
						<CompetitionList
							competitions={competitions}
							selectedCompetitions={selectedCompetitions}
							toggleCompetition={toggleCompetition}
						/>
					</>
				)}
			</div>
			<DynamicContentWrapper>
				<div className={styles.gamelogContent}>
					{selectedCompetitions.map((slug) => (
						<GamesList key={slug} competitionSlug={slug} />
					))}
					{selectedCompetitions.length === 0 && (
						<div className={styles.emptyState}>No competitions selected</div>
					)}
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default TeamGamelog;
