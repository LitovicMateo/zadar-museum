import React from 'react';

import CompetitionDropdown from '@/components/Schedule/Controls/CompetitionDropdown';
import OpponentSearch from '@/components/Schedule/Controls/OpponentSearch';
import SeasonPager from '@/components/Schedule/Controls/SeasonPager';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

const GamesFilter: React.FC = () => {
	const {
		seasons,
		selectedSeason,
		setSelectedSeason,
		isPending,
		competitions,
		selectedCompetition,
		setSelectedCompetition,
		searchTerm,
		setSearchTerm
	} = useGamesContext();

	if (seasons === undefined) {
		return <div>Loading...</div>;
	}

	return (
		<div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 bg-background py-2">
			<SeasonPager
				seasons={seasons}
				selectedSeason={selectedSeason}
				onSeasonChange={setSelectedSeason}
				isPending={isPending}
			/>
			<CompetitionDropdown
				competitions={competitions}
				selected={selectedCompetition}
				onChange={setSelectedCompetition}
			/>
			<div className="min-w-[200px] flex-1">
				<OpponentSearch value={searchTerm} onChange={setSearchTerm} />
			</div>
		</div>
	);
};

export default GamesFilter;
