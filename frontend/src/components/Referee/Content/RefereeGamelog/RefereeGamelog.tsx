import React from 'react';
import { useParams } from 'react-router-dom';

import ScheduleControls from '@/components/Schedule/Controls/ScheduleControls';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { useRefereeGamelog } from '@/hooks/queries/referee/UseRefereeGamelog';
import { useRefereeSeasons } from '@/hooks/queries/referee/UseRefereeSeasons';
import { useScheduleFilters, useSeasonState } from '@/hooks/UseScheduleFilters';

import styles from './RefereeGamelog.module.css';

const RefereeGamelog: React.FC = () => {
	const { refereeId } = useParams();

	const { data: seasons } = useRefereeSeasons(refereeId!);
	const { data: refereeGamelog } = useRefereeGamelog(refereeId!);

	const [selectedSeason, setSelectedSeason] = useSeasonState(seasons);
	const filters = useScheduleFilters(refereeGamelog, selectedSeason);

	if (refereeGamelog === undefined || !seasons) return null;

	return (
		<section className={styles.section}>
			<div className={styles.topFilters}>
				<ScheduleControls
					seasons={seasons}
					selectedSeason={selectedSeason}
					setSelectedSeason={setSelectedSeason}
					{...filters}
				/>
			</div>
			<DynamicContentWrapper>
				<div className={styles.gamelogCard}>
					<ScheduleList schedule={filters.filteredGames} />
				</div>
			</DynamicContentWrapper>
		</section>
	);
};

export default RefereeGamelog;
