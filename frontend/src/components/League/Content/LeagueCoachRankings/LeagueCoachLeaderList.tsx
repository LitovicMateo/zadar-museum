import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueCoachRankings } from '@/hooks/queries/league/UseLeagueCoachRankings';
import { CoachStatsRanking } from '@/types/api/Coach';

import styles from './LeagueCoachLeaderList.module.css';

const MEDAL_CLASS: Record<number, string> = {
	0: styles.gold,
	1: styles.silver,
	2: styles.bronze
};

const formatValue = (stat: keyof CoachStatsRanking, value: number): string => {
	if (stat === 'win_percentage') return `${value.toFixed(1)}%`;
	return String(value);
};

const LeagueCoachLeaderList: React.FC<{
	stat: keyof CoachStatsRanking;
	leagueSlug: string | undefined;
}> = ({ leagueSlug, stat }) => {
	const { data: coachRankings } = useLeagueCoachRankings(leagueSlug!, stat);

	if (coachRankings && coachRankings.length === 0) {
		return <div className={styles.empty}>No ranking data available for this league.</div>;
	}

	return (
		<section>
			<ul className={styles.list}>
				<li className={styles.header}>
					<span>#</span>
					<span>Coach</span>
					<span>Record</span>
				</li>
				{coachRankings?.map((c, index) => (
					<li key={c.coach_id} className={`${styles.item} ${MEDAL_CLASS[index] ?? ''}`}>
						<div className={styles.itemInner}>
							<span className={styles.rank}>{index + 1}</span>
							<span className={styles.name}>
								<Link to={APP_ROUTES.coach(c.coach_id)}>
									{c.first_name} {c.last_name}
								</Link>
							</span>
							<span className={styles.statValue}>{formatValue(stat, c[stat] as number)}</span>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};

export default LeagueCoachLeaderList;
