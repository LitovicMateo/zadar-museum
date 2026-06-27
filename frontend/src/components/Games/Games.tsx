import React from 'react';

import GamesFilter from '@/components/Games/GamesFilter/GamesFilter';
import NoContent from '@/components/NoContent/NoContent';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import PageContentWrapper from '@/components/UI/PageContentWrapper';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import styles from '@/components/Games/Games.module.css';

const GamesContent: React.FC = () => {
	const { schedule, filteredSchedule, scheduleLoading, isPending, teamSlug } = useGamesContext();

	const noGames = !scheduleLoading && schedule && schedule.length === 0;
	const noMatches = !scheduleLoading && !noGames && (filteredSchedule?.length ?? 0) === 0;

	return (
		<PageContentWrapper>
			<div className={styles.page}>
				<GamesFilter />
				<DynamicContentWrapper>
					{scheduleLoading && <div>Loading...</div>}
					{noGames && <NoContent type="info" description={<p>There are no games in the database.</p>} />}
					{noMatches && <NoContent type="info" description={<p>No games match the current filters.</p>} />}

					<div
						className={styles.container}
						style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}
					>
						<ScheduleList schedule={filteredSchedule} perspectiveSlug={teamSlug} />
					</div>
				</DynamicContentWrapper>
			</div>
		</PageContentWrapper>
	);
};

export default GamesContent;
