import React from 'react';
import { useParams } from 'react-router-dom';

import CompetitionDropdown from '@/components/Schedule/Controls/CompetitionDropdown';
import OpponentSearch from '@/components/Schedule/Controls/OpponentSearch';
import SeasonPager from '@/components/Schedule/Controls/SeasonPager';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import NoData from '@/components/UI/NoData/NoData';
import { useCoachGamelog } from '@/hooks/queries/coach/UseCoachGamelog';
import { useCoachSeasons } from '@/hooks/queries/coach/UseCoachSeasons';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { useIsMobile } from '@/hooks/UseMobile';
import { useScheduleFilters, useSeasonState } from '@/hooks/UseScheduleFilters';

const CoachGamelog: React.FC = () => {
	const isMobile = useIsMobile();
	const { coachId } = useParams();

	const { db } = useCoachProfileDatabase(coachId!);
	const { data: seasons } = useCoachSeasons(coachId!);
	const { data: coachGamelog } = useCoachGamelog(coachId!, db);

	const [selectedSeason, setSelectedSeason] = useSeasonState(seasons);
	const { competitions, selectedCompetition, setSelectedCompetition, searchTerm, setSearchTerm, filteredGames } =
		useScheduleFilters(coachGamelog, selectedSeason);

	return (
		<section className="space-y-4">
			<div className="flex items-center gap-3">
				<SeasonPager
					seasons={seasons || []}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
					compact={isMobile}
				/>
				<div className="min-w-0 flex-1">
					<OpponentSearch value={searchTerm} onChange={setSearchTerm} />
				</div>
			</div>

			<MobileFilterSheet title="Filter games">
				<CompetitionDropdown
					competitions={competitions}
					selected={selectedCompetition}
					onChange={setSelectedCompetition}
				/>
			</MobileFilterSheet>

			<DynamicContentWrapper>
				{filteredGames.length === 0 && <NoData>No games match the current filters</NoData>}
				<ScheduleList schedule={filteredGames} />
			</DynamicContentWrapper>
		</section>
	);
};

export default CoachGamelog;
