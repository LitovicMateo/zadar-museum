import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import Heading from '@/components/ui/heading';
import { useVenueGamelog } from '@/hooks/queries/venue/useVenueGamelog';
import { useScheduleTable } from '@/hooks/useScheduleTable';

import Filters from './filter';
import SeasonStats from './season-stats';

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

	const { Schedule } = useScheduleTable(filteredGames!);

	console.log(games);

	if (games && games.length === 0 && selectedSeason) {
		return <NoContent type="info" description="No games have been played at this venue in the selected season." />;
	}

	return (
		<section className="flex flex-col gap-4 min-h-[500px]">
			<Heading title="Season Data" />

			<Filters
				season={selectedSeason}
				setSelectedSeason={setSelectedSeason}
				selectedCompetitions={selectedCompetitions}
				setSelectedCompetitions={setSelectedCompetitions}
			/>
			<SeasonStats season={selectedSeason} />
			<Heading title="Gamelog" type="secondary" />
			<Schedule />
		</section>
	);
};

export default VenueGamelog;
