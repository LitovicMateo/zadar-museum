import React from 'react';
import { useParams } from 'react-router-dom';

import ScheduleControls from '@/components/Schedule/Controls/ScheduleControls';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import NoData from '@/components/UI/NoData/NoData';
import { useCoachGamelog } from '@/hooks/queries/coach/UseCoachGamelog';
import { useCoachSeasons } from '@/hooks/queries/coach/UseCoachSeasons';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { useScheduleFilters, useSeasonState } from '@/hooks/UseScheduleFilters';

import styles from './CoachGamelog.module.css';

const CoachGamelog: React.FC = () => {
	const { coachId } = useParams();

	const { db } = useCoachProfileDatabase(coachId!);
	const { data: seasons } = useCoachSeasons(coachId!);
	const { data: coachGamelog } = useCoachGamelog(coachId!, db);

	const [selectedSeason, setSelectedSeason] = useSeasonState(seasons);
	const filters = useScheduleFilters(coachGamelog, selectedSeason);

	return (
		<section className={styles.section}>
			<ScheduleControls
				seasons={seasons || []}
				selectedSeason={selectedSeason}
				setSelectedSeason={setSelectedSeason}
				{...filters}
			/>

			<div className={styles.gamelogCard}>
				<DynamicContentWrapper>
					{filters.filteredGames.length === 0 && <NoData>No games match the current filters</NoData>}
					<ScheduleList schedule={filters.filteredGames} />
				</DynamicContentWrapper>
			</div>
		</section>
	);
};

export default CoachGamelog;
