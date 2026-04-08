import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CompetitionSelectItem from '@/components/Games/GamesFilter/CompetitionSelect';
import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import NoContent from '@/components/NoContent/NoContent';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { useVenueGamelog } from '@/hooks/queries/venue/UseVenueGamelog';
import { useVenueSeasonCompetitions } from '@/hooks/queries/venue/UseVenueSeasonCompetitions';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';

import styles from './VenueGamelog.module.css';

const VenueGamelog = () => {
	const { venueSlug } = useParams();

	const [selectedSeason, setSelectedSeason] = React.useState('');
	const [selectedCompetitions, setSelectedCompetitions] = React.useState<string[]>([]);

	const { data: games } = useVenueGamelog(venueSlug!, selectedSeason);

	const filteredGames = React.useMemo(() => {
		if (!games) return [];
		const filtered = games.filter((g) => selectedCompetitions.includes(g.league_id));
		return filtered;
	}, [games, selectedCompetitions]);

	const { data: seasons } = useVenueSeasons(venueSlug!);
	const { data: competitions } = useVenueSeasonCompetitions(venueSlug!, selectedSeason);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, setSelectedSeason]);

	useEffect(() => {
		if (competitions && competitions.length > 0) {
			setSelectedCompetitions(competitions.map((c) => c.league_id));
		}
	}, [competitions, selectedSeason, setSelectedCompetitions]);

	const toggleCompetition = React.useCallback((slug: string) => {
		setSelectedCompetitions((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
	}, []);

	if (!selectedSeason || !competitions || !seasons) {
		return <NoContent type="info" description="No games have been played at this venue." />;
	}

	if (games && games.length === 0 && selectedSeason) {
		return <NoContent type="info" description="No games have been played at this venue in the selected season." />;
	}

	return (
		<div className={styles.section}>
			<div className={styles.topFilters}>
				<SeasonSelect
					compact
					seasons={seasons}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
				/>
			</div>
			<div className={styles.filters}>
				{competitions.map((c) => (
					<CompetitionSelectItem
						key={c.league_id}
						leagueId={c.league_id}
						leagueName={c.league_name}
						leagueShortName={c.league_short_name}
						onCompetitionChange={toggleCompetition}
						selectedCompetitions={selectedCompetitions}
					/>
				))}
			</div>
			<DynamicContentWrapper>
				<ScheduleList schedule={filteredGames} />
			</DynamicContentWrapper>
		</div>
	);
};

export default VenueGamelog;
