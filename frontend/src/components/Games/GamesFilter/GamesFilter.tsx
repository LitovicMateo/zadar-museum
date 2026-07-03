import React from 'react';

import CompetitionDropdown from '@/components/Schedule/Controls/CompetitionDropdown';
import OpponentSearch from '@/components/Schedule/Controls/OpponentSearch';
import SeasonPager from '@/components/Schedule/Controls/SeasonPager';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import { useGamesContext } from '@/hooks/context/UseGamesContext';
import { useIsMobile } from '@/hooks/UseMobile';

const GamesFilter: React.FC = () => {
	const isMobile = useIsMobile();
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
		<div className="sticky top-0 z-10 space-y-2 bg-background py-2">
			<div className="flex items-center gap-3">
				<SeasonPager
					seasons={seasons}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
					isPending={isPending}
					compact={isMobile}
				/>
				<div className="min-w-0 flex-1">
					<OpponentSearch value={searchTerm} onChange={setSearchTerm} />
				</div>
			</div>
			<MobileFilterSheet title="Filter games">
				<CompetitionDropdown
					competitions={competitions}
					selected={selectedCompetition}
					onChange={setSelectedCompetition}
				/>
			</MobileFilterSheet>
		</div>
	);
};

export default GamesFilter;
