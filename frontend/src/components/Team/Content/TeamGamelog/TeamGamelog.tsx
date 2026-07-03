import React from 'react';

import CompetitionDropdown from '@/components/Schedule/Controls/CompetitionDropdown';
import OpponentSearch from '@/components/Schedule/Controls/OpponentSearch';
import SeasonPager from '@/components/Schedule/Controls/SeasonPager';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

const TeamGamelog: React.FC = () => {
	const {
		seasons,
		selectedSeason,
		setSelectedSeason,
		isPending,
		competitions,
		selectedCompetition,
		setSelectedCompetition,
		searchTerm,
		setSearchTerm,
		filteredSchedule,
		scheduleLoading,
		teamSlug
	} = useGamesContext();

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
				{scheduleLoading || !seasons ? (
					<span className="text-sm text-muted-foreground">Loading…</span>
				) : (
					<>
						<MobileFilterSheet title="Filter games">
							<SeasonPager
								seasons={seasons}
								selectedSeason={selectedSeason}
								onSeasonChange={setSelectedSeason}
								isPending={isPending}
							/>
							<CompetitionDropdown
								competitions={competitions}
								selected={selectedCompetition}
								onChange={setSelectedCompetition}
							/>
						</MobileFilterSheet>
						<OpponentSearch value={searchTerm} onChange={setSearchTerm} />
					</>
				)}
			</div>
			<DynamicContentWrapper>
				<div
					className="flex flex-col gap-8"
					style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}
				>
					<ScheduleList schedule={filteredSchedule} perspectiveSlug={teamSlug} />
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default TeamGamelog;
