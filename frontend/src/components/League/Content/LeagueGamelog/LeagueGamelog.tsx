import { useParams } from 'react-router-dom';

import ScheduleControls from '@/components/Schedule/Controls/ScheduleControls';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper/DynamicContentWrapper';
import { useLeagueGames } from '@/hooks/queries/league/UseLeagueGames';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';
import { useScheduleFilters, useSeasonState } from '@/hooks/UseScheduleFilters';

const LeagueGamelog = () => {
	const { leagueSlug } = useParams();

	const { data: seasons } = useLeagueSeasons(leagueSlug!);
	const [selectedSeason, setSelectedSeason] = useSeasonState(seasons);

	const { data: leagueGamelog } = useLeagueGames(leagueSlug!, selectedSeason);
	const filters = useScheduleFilters(leagueGamelog, selectedSeason);

	if (!seasons) return null;

	return (
		<section className="space-y-4">
			<ScheduleControls
				seasons={seasons}
				selectedSeason={selectedSeason}
				setSelectedSeason={setSelectedSeason}
				showCompetition={false}
				{...filters}
			/>
			<DynamicContentWrapper>
				<ScheduleList schedule={filters.filteredGames} />
			</DynamicContentWrapper>
		</section>
	);
};

export default LeagueGamelog;
