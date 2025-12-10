import React from 'react';

import CompetitionList from '@/components/games-page/games-filter/competition-list';
import RightControls from '@/components/games-page/games-filter/right-controls';
import MobileFilters from '@/components/mobile-filters/MobileFilters';
import { useGamesContext } from '@/hooks/context/useGamesContext';

const GamesFilter: React.FC = () => {
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
		<aside className="block w-full sticky top-0 bg-white z-10 py-2 px-3 border-b border-gray-100">
			<MobileFilters SearchInput={teamName === 'KK Zadar' ? SearchInput : undefined} title="Filters">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
					<CompetitionList
						competitions={competitions}
						selectedCompetitions={selectedCompetitions}
						toggleCompetition={toggleCompetition}
					/>

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
