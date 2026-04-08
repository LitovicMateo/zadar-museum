import React from 'react';

import CompetitionList from '@/components/Games/GamesFilter/CompetitionList';
import RightControls from '@/components/Games/GamesFilter/RightControls';
import MobileFilters from '@/components/MobileFilters/MobileFilters';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import styles from './GamesFilter.module.css';

interface Props {
	showCompetitions?: boolean;
}

const GamesFilter: React.FC<Props> = ({ showCompetitions = true }) => {
	const {
		selectedSeason,
		setSelectedSeason,
		competitions,
		selectedCompetitions,
		toggleCompetition,
		SearchInput,
		seasons,
		scheduleLoading,
		teamName
	} = useGamesContext();

	if (seasons === undefined || competitions === undefined || scheduleLoading) {
		return <div>Loading...</div>;
	}

	return (
		<aside className={styles.aside}>
			<MobileFilters SearchInput={teamName === 'KK Zadar' ? SearchInput : undefined} title="Filters">
				<div className={styles.wrapper}>
					{showCompetitions && (
						<CompetitionList
							competitions={competitions}
							selectedCompetitions={selectedCompetitions}
							toggleCompetition={toggleCompetition}
						/>
					)}

					{/* Right controls: season select (search is passed to MobileFilters) */}
					<RightControls
						seasons={seasons}
						selectedSeason={selectedSeason}
						onSeasonChange={setSelectedSeason}
						compact
					/>
				</div>
			</MobileFilters>
		</aside>
	);
};

export default GamesFilter;
