import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CompetitionSelectItem from '@/components/games-page/games-filter/CompetitionSelect';
import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import { useVenueSeasonCompetitions } from '@/hooks/queries/venue/UseVenueSeasonCompetitions';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';
import styles from './Filter.module.css';

type FiltersProps = {
	season: string;
	setSelectedSeason: React.Dispatch<React.SetStateAction<string>>;
	selectedCompetitions: string[];
	setSelectedCompetitions: React.Dispatch<React.SetStateAction<string[]>>;
};

const Filters: React.FC<FiltersProps> = ({
	season,
	selectedCompetitions,
	setSelectedCompetitions,
	setSelectedSeason
}) => {
	const { venueSlug } = useParams();

	const { data: seasons } = useVenueSeasons(venueSlug!);
	const { data: competitions } = useVenueSeasonCompetitions(venueSlug!, season);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, setSelectedSeason]);

	useEffect(() => {
		if (competitions && competitions.length > 0) {
			setSelectedCompetitions(competitions.map((c) => c.league_id));
		}
	}, [competitions, season, setSelectedCompetitions]);

	const toggleCompetition = (slug: string) => {
		setSelectedCompetitions((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
	};

	if (!season || !competitions || !seasons) return null;

	return (
		<div className={styles.wrapper}>
			<div className={styles.competitions}>
				{competitions.map((c) => (
					<CompetitionSelectItem
						key={c.league_id}
						leagueId={c.league_id}
						leagueName={c.league_name}
						onCompetitionChange={toggleCompetition}
						selectedCompetitions={selectedCompetitions}
					/>
				))}
			</div>
			<SeasonSelect seasons={seasons} selectedSeason={season} onSeasonChange={setSelectedSeason} />
		</div>
	);
};

export default Filters;
