import React from 'react';

import { TeamCompetitionsResponse } from '@/types/api/Team';

import CompetitionDropdown from './CompetitionDropdown';
import OpponentSearch from './OpponentSearch';
import SeasonPager from './SeasonPager';

type ScheduleControlsProps = {
	seasons: string[];
	selectedSeason: string;
	setSelectedSeason: (s: string) => void;
	competitions?: TeamCompetitionsResponse[];
	selectedCompetition: string;
	setSelectedCompetition: (v: string) => void;
	searchTerm: string;
	setSearchTerm: (v: string) => void;
	/** Hide the competition dropdown (e.g. league pages with a single competition). */
	showCompetition?: boolean;
	isPending?: boolean;
};

const ScheduleControls: React.FC<ScheduleControlsProps> = ({
	seasons,
	selectedSeason,
	setSelectedSeason,
	competitions,
	selectedCompetition,
	setSelectedCompetition,
	searchTerm,
	setSearchTerm,
	showCompetition = true,
	isPending
}) => (
	<div className="flex flex-wrap items-center gap-3">
		<SeasonPager
			seasons={seasons}
			selectedSeason={selectedSeason}
			onSeasonChange={setSelectedSeason}
			isPending={isPending}
			compact
		/>
		{showCompetition && (
			<CompetitionDropdown
				competitions={competitions}
				selected={selectedCompetition}
				onChange={setSelectedCompetition}
			/>
		)}
		<div className="min-w-[200px] flex-1">
			<OpponentSearch value={searchTerm} onChange={setSearchTerm} />
		</div>
	</div>
);

export default ScheduleControls;
