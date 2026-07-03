import React from 'react';
import { useParams } from 'react-router-dom';

import ScheduleControls from '@/components/Schedule/Controls/ScheduleControls';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { useRefereeGamelog } from '@/hooks/queries/referee/UseRefereeGamelog';
import { useRefereeSeasons } from '@/hooks/queries/referee/UseRefereeSeasons';
import { useScheduleFilters, useSeasonState } from '@/hooks/UseScheduleFilters';

const RefereeGamelog: React.FC = () => {
	const { refereeId } = useParams();

	const { data: seasons } = useRefereeSeasons(refereeId!);
	const { data: refereeGamelog } = useRefereeGamelog(refereeId!);

	const [selectedSeason, setSelectedSeason] = useSeasonState(seasons);
	const filters = useScheduleFilters(refereeGamelog, selectedSeason);

	if (refereeGamelog === undefined || !seasons) return null;

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

export default RefereeGamelog;
