import React from 'react';

import CompetitionDropdown from '@/components/Schedule/Controls/CompetitionDropdown';
import OpponentSearch from '@/components/Schedule/Controls/OpponentSearch';
import SeasonPager from '@/components/Schedule/Controls/SeasonPager';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import styles from './TeamGamelog.module.css';

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
		<div className={styles.wrapper}>
			<div className={styles.gamelogControls}>
				{scheduleLoading || !seasons ? (
					<span>Loading...</span>
				) : (
					<>
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
						<OpponentSearch value={searchTerm} onChange={setSearchTerm} />
					</>
				)}
			</div>
			<DynamicContentWrapper>
				<div
					className={styles.gamelogContent}
					style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}
				>
					<ScheduleList schedule={filteredSchedule} perspectiveSlug={teamSlug} />
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default TeamGamelog;
