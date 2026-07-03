import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { APP_ROUTES } from '@/constants/Routes';
import { TeamDirectoryEntry } from '@/types/api/Team';

import styles from './TeamLeaders.module.css';

const LEADER_CATEGORIES = [
	{ key: 'games', label: 'Games Played' },
	{ key: 'losses', label: 'Wins' },
	{ key: 'wins', label: 'Losses' },
	{ key: 'win_percentage', label: 'Win Percentage' }
] as const;

type StatKey = (typeof LEADER_CATEGORIES)[number]['key'];

const TOP_N = 5;

interface TeamLeadersProps {
	stats: TeamDirectoryEntry[] | undefined;
}

const TeamLeaders: React.FC<TeamLeadersProps> = ({ stats }) => {
	const leadersByCategory = useMemo(() => {
		if (!stats) return null;

		return LEADER_CATEGORIES.map(({ key, label }) => {
			if (key === 'win_percentage') {
				const sorted = [...stats]
					.sort((a, b) => {
						if (+a[key] === +b[key]) {
							return +b.games - +a.games;
						}
						return +a[key] - +b[key];
					})
					.slice(0, TOP_N);

				sorted.forEach((team) => {
					(team as any).win_percentage = 100 - Number(team.win_percentage);
				});
				return { key, label, leaders: sorted };
			}
			const sorted = [...stats].sort((a, b) => +b[key] - +a[key]).slice(0, TOP_N);
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
						{leaders.map((team, index) => {
							const rankRowClass = [styles.rowFirst, styles.rowSecond, styles.rowThird][index];
							const rankBadgeClass = [styles.rankFirst, styles.rankSecond, styles.rankThird][index];
							return (
								<li key={team.id} className={`${styles.row} ${rankRowClass ?? ''}`}>
									<span className={`${styles.rank} ${rankBadgeClass ?? ''}`}>
										{index < 3 ? <Medal size={11} /> : index + 1}
									</span>
									<Link to={APP_ROUTES.team(team.slug)} className={styles.teamName}>
										{team.name}
									</Link>
									<span className={styles.statValue}>{team[key as StatKey].toLocaleString()}</span>
								</li>
							);
						})}
					</ol>
				</Card>
			))}
		</aside>
	);
};

export default TeamLeaders;
