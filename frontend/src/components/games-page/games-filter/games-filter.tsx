import React from 'react';

import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';
import SeasonSelect from '@/components/games-page/games-filter/season-select';
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
		<aside className="block w-full sticky top-0 bg-white z-1000 py-2 px-3 border-b border-gray-100">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
				<div className="flex gap-2 overflow-x-auto no-scrollbar pr-2 items-center">
					{competitions?.map((competition) => (
						<CompetitionSelectItem
							key={competition.league_id}
							leagueName={competition.league_name}
							leagueId={competition.league_id}
							selectedCompetitions={selectedCompetitions}
							onCompetitionChange={toggleCompetition}
						/>
					))}
				</div>

				{/* Right controls: season select and optional search */}
				<div className="flex items-center gap-2">
					<SeasonSelect
						seasons={seasons ?? []}
						selectedSeason={selectedSeason}
						onSeasonChange={setSelectedSeason}
						compact
					/>

					{teamName === 'KK Zadar' ? <div className="ml-1">{SearchInput}</div> : null}
				</div>
			</div>
		</aside>
	);
};

export default GamesFilter;
