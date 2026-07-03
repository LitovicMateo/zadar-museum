import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { APP_ROUTES } from '@/constants/Routes';
import { RefereeDirectoryEntry } from '@/types/api/Referee';

import styles from './RefereeLeaders.module.css';

const LEADER_CATEGORIES = [
	{ key: 'games', label: 'Games Played', ascending: false },
	{ key: 'fouls_for', label: 'Fouls For', ascending: false },
	{ key: 'fouls_against', label: 'Fouls Against', ascending: false },
	{ key: 'foul_difference_best', label: 'Foul Diff (Best)', ascending: false },
	{ key: 'foul_difference_worst', label: 'Foul Diff (Worst)', ascending: true }
] as const;

type StatKey = (typeof LEADER_CATEGORIES)[number]['key'];

const TOP_N = 5;

interface RefereeLeadersProps {
	stats: RefereeDirectoryEntry[];
}

const RefereeLeaders: React.FC<RefereeLeadersProps> = ({ stats }) => {
	const leadersByCategory = useMemo(() => {
		if (!stats) return null;
		return LEADER_CATEGORIES.map(({ key, label, ascending }) => {
			const sorted = [...stats]
				.sort((a, b) =>
					ascending ? +(a[key] ?? 0) - +(b[key] ?? 0) : +(b[key] ?? 0) - +(a[key] ?? 0)
				)
				.slice(0, TOP_N);
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
						{leaders.map((referee, index) => {
							const rankRowClass = [styles.rowFirst, styles.rowSecond, styles.rowThird][index];
							const rankBadgeClass = [styles.rankFirst, styles.rankSecond, styles.rankThird][index];
							return (
								<li key={referee.document_id} className={`${styles.row} ${rankRowClass ?? ''}`}>
									<span className={`${styles.rank} ${rankBadgeClass ?? ''}`}>
										{index < 3 ? <Medal size={11} /> : index + 1}
									</span>
									<Link to={APP_ROUTES.referee(referee.document_id)} className={styles.refereeName}>
										{referee.name}
									</Link>
									<span className={styles.statValue}>{referee[key as StatKey]?.toLocaleString()}</span>
								</li>
							);
						})}
					</ol>
				</Card>
			))}
		</aside>
	);
};

export default RefereeLeaders;
