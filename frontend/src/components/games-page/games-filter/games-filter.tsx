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
		<aside className={`block w-full sticky top-0 bg-white z-[1000] py-2`}>
			<div className="flex justify-between gap-4">
				<div className="flex gap-4">
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
				{/* Only show search if not the default KK Zadar team */}
				<div className="flex justify-between gap-4">
					<SeasonSelect
						seasons={seasons ?? []}
						selectedSeason={selectedSeason}
						onSeasonChange={setSelectedSeason}
					/>
					{teamName === 'KK Zadar' ? <>{SearchInput}</> : null}
				</div>
			</div>
		</aside>
	);
};

export default GamesFilter;
