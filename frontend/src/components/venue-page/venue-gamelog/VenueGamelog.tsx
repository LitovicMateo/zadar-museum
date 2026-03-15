import React from 'react';
import { useParams } from 'react-router-dom';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import NoContent from '@/components/no-content/NoContent';
import Heading from '@/components/ui/Heading';
import { useVenueGamelog } from '@/hooks/queries/venue/UseVenueGamelog';

import Filters from './Filter';
import SeasonStats from './SeasonStats';

import styles from './VenueGamelog.module.css';

const VenueGamelog: React.FC = () => {
	const { venueSlug } = useParams();

	const [selectedSeason, setSelectedSeason] = React.useState('');
	const [selectedCompetitions, setSelectedCompetitions] = React.useState<string[]>([]);

	const { data: games } = useVenueGamelog(venueSlug!, selectedSeason);

	const filteredGames = React.useMemo(() => {
		if (!games) return [];
		const filtered = games.filter((g) => selectedCompetitions.includes(g.league_id));
		return filtered;
	}, [games, selectedCompetitions]);

	if (games && games.length === 0 && selectedSeason) {
		return <NoContent type="info" description="No games have been played at this venue in the selected season." />;
	}

	return (
		<section className={styles.section}>
			<Heading title="Season Data" />

			<Filters
				season={selectedSeason}
				setSelectedSeason={setSelectedSeason}
				selectedCompetitions={selectedCompetitions}
				setSelectedCompetitions={setSelectedCompetitions}
			/>
			<SeasonStats season={selectedSeason} />
			<Heading title="Gamelog" type="secondary" />
			<ScheduleList schedule={filteredGames} />
		</section>
	);
};

export default VenueGamelog;
