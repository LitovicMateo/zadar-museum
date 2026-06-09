import React, { useMemo } from 'react';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import Heading from '@/components/UI/Heading';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import { groupGames } from './GamesList.util';

import styles from './GamesList.module.css';

type GamesListProps = {
	competitionSlug: string;
};

const GamesList: React.FC<GamesListProps> = ({ competitionSlug }) => {
	const { filteredSchedule, scheduleLoading, competitions } = useGamesContext();

	const leagueName = competitions?.find((c) => c.league_id === competitionSlug)?.league_name;

	const groupedGames = useMemo(
		() => groupGames(filteredSchedule, competitionSlug),
		[filteredSchedule, competitionSlug]
	);

	if (scheduleLoading) {
		return <div>Loading...</div>;
	}

	return (
		<section className={styles.section}>
			<Heading title={leagueName ?? ''} type="secondary" />
			{groupedGames.map(([groupName, games]) => {
				const hideGroupPrefix = groupName.length > 1;
				return (
					<div key={groupName || '__no_group__'} className={styles.group}>
						{groupName && (
							<p className={styles.groupLabel}>
								{hideGroupPrefix ? '' : 'Group '}
								{groupName}
							</p>
						)}
						<ScheduleList schedule={games} />
					</div>
				);
			})}
		</section>
	);
};

export default GamesList;
