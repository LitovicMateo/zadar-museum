import React from 'react';

import CompetitionSelectItem from '@/components/Games/GamesFilter/CompetitionSelect';
import SearchBar from '@/components/Games/GamesFilter/SearchBar';
import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import { Competition } from '@/hooks/queries/coach/UseCoachSeasonCompetitions';

import styles from './CoachGamelogFilters.module.css';

interface CoachGamelogFiltersProps {
	seasons: string[];
	selectedSeason: string;
	setSelectedSeason: (season: string) => void;
	selectedCompetitions: string[];
	setSelectedCompetitions: (competitions: string[]) => void;
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	competitions: Competition[];
}

const CoachGamelogFilters: React.FC<CoachGamelogFiltersProps> = ({
	seasons,
	selectedSeason,
	setSelectedSeason,
	selectedCompetitions,
	setSelectedCompetitions,
	searchTerm,
	setSearchTerm,
	competitions
}) => {
	const toggleCompetition = (leagueId: string) => {
		if (selectedCompetitions.includes(leagueId)) {
			setSelectedCompetitions(selectedCompetitions.filter((c) => c !== leagueId));
		} else {
			setSelectedCompetitions([...selectedCompetitions, leagueId]);
		}
	};
	return (
		<>
			<div className={styles.topFilters}>
				<SeasonSelect
					seasons={seasons || []}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
					compact
				/>
				<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			</div>
			<div className={styles.filters}>
				{competitions.map((c) => (
					<CompetitionSelectItem
						key={String(c.league_id)}
						leagueId={String(c.league_id)}
						leagueName={c.league_name}
						leagueShortName={c.league_short_name}
						onCompetitionChange={toggleCompetition}
						selectedCompetitions={selectedCompetitions}
					/>
				))}
			</div>
		</>
	);
};

export default CoachGamelogFilters;
