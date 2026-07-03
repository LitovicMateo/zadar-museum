import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { APP_ROUTES } from '@/constants/Routes';
import { CoachStatsRanking } from '@/types/api/Coach';

import styles from './CoachesLeaders.module.css';

const LEADER_CATEGORIES = [
	{ key: 'games', label: 'Games Played' },
	{ key: 'wins', label: 'Wins' },
	{ key: 'losses', label: 'Losses' },
	{ key: 'win_percentage', label: 'Win %' }
] as const;

type StatKey = (typeof LEADER_CATEGORIES)[number]['key'];

const TOP_N = 5;

interface CoachesLeadersProps {
	stats: CoachStatsRanking[] | undefined;
}

const CoachesLeaders: React.FC<CoachesLeadersProps> = ({ stats }) => {
	const leadersByCategory = useMemo(() => {
		if (!stats) return null;
		return LEADER_CATEGORIES.map(({ key, label }) => {
			const sorted = [...stats].sort((a, b) => b[key] - a[key]).slice(0, TOP_N);
			return { key, label, leaders: sorted };
		});
	}, [stats]);

	if (!leadersByCategory) return null;

	return (
		<aside className={styles.sidebar}>
			<h3 className={styles.title}>Leaders</h3>
			{leadersByCategory.map(({ key, label, leaders }) => (
				<Card key={key} className="p-0 gap-0 rounded-[10px] overflow-hidden shadow-sm">
					<div className={styles.categoryHeader}>
						<span className={styles.categoryLabel}>{label.toUpperCase()}</span>
					</div>
					<ol className={styles.list}>
						{leaders.map((coach, index) => {
							const rankRowClass = [styles.rowFirst, styles.rowSecond, styles.rowThird][index];
							const rankBadgeClass = [styles.rankFirst, styles.rankSecond, styles.rankThird][index];
							return (
								<li key={coach.coach_id} className={`${styles.row} ${rankRowClass ?? ''}`}>
									<span className={`${styles.rank} ${rankBadgeClass ?? ''}`}>
										{index < 3 ? <Medal size={11} /> : index + 1}
									</span>
									<Link to={APP_ROUTES.coach(coach.coach_id)} className={styles.coachName}>
										{coach.first_name} {coach.last_name}
									</Link>
									<span className={styles.statValue}>{coach[key as StatKey].toLocaleString()}</span>
								</li>
							);
						})}
					</ol>
				</Card>
			))}
		</aside>
	);
};

export default CoachesLeaders;
