import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { RefereeDirectoryEntry } from '@/types/api/Referee';

import styles from './RefereeLeaders.module.css';

const LEADER_CATEGORIES = [
	{ key: 'games', label: 'Games Played' },
	{ key: 'fouls_for', label: 'Fouls For' },
	{ key: 'fouls_against', label: 'Fouls Against' },
	{ key: 'foul_difference_best', label: 'Foul Difference (Best)' },
	{ key: 'foul_difference_worst', label: 'Foul Difference (Worst)' }
] as const;

type StatKey = (typeof LEADER_CATEGORIES)[number]['key'];

const TOP_N = 5;

interface RefereeLeadersProps {
	stats: RefereeDirectoryEntry[];
}

const RefereeLeaders: React.FC<RefereeLeadersProps> = ({ stats }) => {
	const leadersByCategory = useMemo(() => {
		if (!stats) return null;

		return LEADER_CATEGORIES.map(({ key, label }) => {
			// if key is fould_difference_worst, sort in ascending order instead of descending
			const sorted =
				key === 'foul_difference_worst'
					? [...stats].sort((a, b) => +(a[key] ?? 0) - +(b[key] ?? 0)).slice(0, TOP_N)
					: [...stats].sort((a, b) => +(b[key] ?? 0) - +(a[key] ?? 0)).slice(0, TOP_N);

			return { key, label, leaders: sorted };
		});
	}, [stats]);

	if (!leadersByCategory) return null;

	return (
		<aside className={styles.sidebar}>
			<h3 className={styles.title}>Leaders</h3>
			{leadersByCategory.map(({ key, label, leaders }) => (
				<div key={key} className={styles.category}>
					<h4 className={styles.categoryTitle}>{label}</h4>
					<ol className={styles.list}>
						{leaders.map((referee, index) => (
							<li key={referee.document_id} className={styles.row}>
								<span className={styles.rank}>{index + 1}</span>
								<Link to={APP_ROUTES.referee(referee.document_id)} className={styles.refereeName}>
									{referee.name}
								</Link>
								<span className={styles.statValue}>{referee[key as StatKey]?.toLocaleString()}</span>
							</li>
						))}
					</ol>
				</div>
			))}
		</aside>
	);
};

export default RefereeLeaders;
