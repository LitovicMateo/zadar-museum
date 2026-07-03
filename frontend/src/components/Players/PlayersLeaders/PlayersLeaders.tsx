import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { APP_ROUTES } from '@/constants/Routes';
import { PlayerAllTimeStats } from '@/types/api/Player';

import styles from './PlayersLeaders.module.css';

const LEADER_CATEGORIES = [
	{ key: 'points', label: 'Points' },
	{ key: 'rebounds', label: 'Rebounds' },
	{ key: 'assists', label: 'Assists' },
	{ key: 'three_pointers_made', label: '3PT Made' },
	{ key: 'games', label: 'Games Played' }
] as const;

type StatKey = (typeof LEADER_CATEGORIES)[number]['key'];

const TOP_N = 5;

interface PlayersLeadersProps {
	stats: PlayerAllTimeStats[] | undefined;
}

const PlayersLeaders: React.FC<PlayersLeadersProps> = ({ stats }) => {
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
						{leaders.map((player, index) => {
							const rankRowClass = [styles.rowFirst, styles.rowSecond, styles.rowThird][index];
							const rankBadgeClass = [styles.rankFirst, styles.rankSecond, styles.rankThird][index];
							return (
								<li key={player.player_id} className={`${styles.row} ${rankRowClass ?? ''}`}>
									<span className={`${styles.rank} ${rankBadgeClass ?? ''}`}>
										{index < 3 ? <Medal size={11} /> : index + 1}
									</span>
									<Link to={APP_ROUTES.player(player.player_id)} className={styles.playerName}>
										{player.first_name} {player.last_name}
									</Link>
									<span className={styles.statValue}>{player[key as StatKey].toLocaleString()}</span>
								</li>
							);
						})}
					</ol>
				</Card>
			))}
		</aside>
	);
};

export default PlayersLeaders;
