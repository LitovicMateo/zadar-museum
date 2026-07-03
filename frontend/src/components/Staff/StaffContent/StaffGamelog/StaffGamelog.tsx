import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import ScheduleControls from '@/components/Schedule/Controls/ScheduleControls';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { useStaffGamelog } from '@/hooks/queries/staff/UseStaffGamelog';
import { useScheduleFilters, useSeasonState } from '@/hooks/UseScheduleFilters';

import { deriveSeasons } from './StaffGamelog.utils';

const StaffGamelog: React.FC = () => {
	const { staffId } = useParams();

	const { data: gamelog = [] } = useStaffGamelog(staffId!);

	const seasons = useMemo(() => deriveSeasons(gamelog), [gamelog]);

	const [selectedSeason, setSelectedSeason] = useSeasonState(seasons);
	const filters = useScheduleFilters(gamelog, selectedSeason);

	return (
		<section className="space-y-4">
			<ScheduleControls
				seasons={seasons}
				selectedSeason={selectedSeason}
				setSelectedSeason={setSelectedSeason}
				{...filters}
			/>
			<DynamicContentWrapper>
				{filters.filteredGames.length === 0 && (
					<p className="py-8 text-center text-sm text-muted-foreground">No games match the current filters.</p>
				)}
				<ScheduleList schedule={filters.filteredGames} />
			</DynamicContentWrapper>
		</section>
	);
};

export default StaffGamelog;
