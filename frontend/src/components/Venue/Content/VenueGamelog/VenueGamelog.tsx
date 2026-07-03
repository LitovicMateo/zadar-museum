import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import ScheduleControls from '@/components/Schedule/Controls/ScheduleControls';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { useVenueGamelog } from '@/hooks/queries/venue/UseVenueGamelog';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';
import { useScheduleFilters, useSeasonState } from '@/hooks/UseScheduleFilters';

const VenueGamelog = () => {
	const { venueSlug } = useParams();

	const { data: seasons } = useVenueSeasons(venueSlug!);
	const [selectedSeason, setSelectedSeason] = useSeasonState(seasons);

	const { data: games } = useVenueGamelog(venueSlug!, selectedSeason);
	const filters = useScheduleFilters(games, selectedSeason);

	if (!selectedSeason || !seasons) {
		return <NoContent type="info" description="No games have been played at this venue." />;
	}

	if (games && games.length === 0) {
		return <NoContent type="info" description="No games have been played at this venue in the selected season." />;
	}

	return (
		<section className="space-y-4">
			<ScheduleControls
				seasons={seasons}
				selectedSeason={selectedSeason}
				setSelectedSeason={setSelectedSeason}
				{...filters}
			/>
			<DynamicContentWrapper>
				<ScheduleList schedule={filters.filteredGames} />
			</DynamicContentWrapper>
		</section>
	);
};

export default VenueGamelog;
