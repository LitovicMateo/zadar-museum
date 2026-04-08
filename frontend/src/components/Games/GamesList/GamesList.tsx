import React, { useMemo } from 'react';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import Heading from '@/components/UI/Heading';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import styles from './GamesList.module.css';

type GamesListProps = {
	competitionSlug: string;
};

const GamesList: React.FC<GamesListProps> = ({ competitionSlug }) => {
	const { filteredSchedule, scheduleLoading, competitions } = useGamesContext();

	const leagueName = competitions?.find((c) => c.league_id === competitionSlug)?.league_name;

	const groupedGames = useMemo(() => {
		const games = filteredSchedule?.filter((g) => g.league_id === competitionSlug) ?? [];

		// Bucket games by group_name (empty string = no group)
		const groups = new Map<string, typeof games>();
		for (const game of games) {
			const key = game.group_name || '';
			if (!groups.has(key)) groups.set(key, []);
			groups.get(key)!.push(game);
		}

		// Sort games within each group by round (numeric)
		for (const groupGames of groups.values()) {
			groupGames.sort((a, b) => +a.round - +b.round);
		}

		// Sort groups by the earliest game date in each group
		return [...groups.entries()].sort(([, aGames], [, bGames]) => {
			const aDate = Math.min(...aGames.map((g) => new Date(g.game_date).getTime()));
			const bDate = Math.min(...bGames.map((g) => new Date(g.game_date).getTime()));
			return aDate - bDate;
		});
	}, [filteredSchedule, competitionSlug]);

	if (scheduleLoading) {
		return <div>Loading...</div>;
	}

	return (
		<section className={styles.section}>
			<Heading title={leagueName ?? ''} type="secondary" />
			{groupedGames.map(([groupName, games]) => (
				<div key={groupName || '__no_group__'} className={styles.group}>
					{groupName && (
						<p className={styles.groupLabel}>
							{leagueName} &ndash; Group {groupName}
						</p>
					)}
					<ScheduleList schedule={games} />
				</div>
			))}
		</section>
	);
};

export default GamesList;
