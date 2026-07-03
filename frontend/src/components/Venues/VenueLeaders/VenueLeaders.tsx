import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { APP_ROUTES } from '@/constants/Routes';
import { VenueDirectoryEntry } from '@/types/api/Venue';

import styles from './VenueLeaders.module.css';

const LEADER_CATEGORIES = [
	{ key: 'games', label: 'Games Played' },
	{ key: 'wins', label: 'Wins' },
	{ key: 'losses', label: 'Losses' },
	{ key: 'win_percentage', label: 'Win Percentage' }
] as const;

type StatKey = (typeof LEADER_CATEGORIES)[number]['key'];

const TOP_N = 5;

interface VenueLeadersProps {
	stats: VenueDirectoryEntry[];
}

const VenueLeaders: React.FC<VenueLeadersProps> = ({ stats }) => {
	const leadersByCategory = useMemo(() => {
		if (!stats) return null;
		return LEADER_CATEGORIES.map(({ key, label }) => {
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
						{leaders.map((venue, index) => {
							const rankRowClass = [styles.rowFirst, styles.rowSecond, styles.rowThird][index];
							const rankBadgeClass = [styles.rankFirst, styles.rankSecond, styles.rankThird][index];
							return (
								<li key={venue.slug} className={`${styles.row} ${rankRowClass ?? ''}`}>
									<span className={`${styles.rank} ${rankBadgeClass ?? ''}`}>
										{index < 3 ? <Medal size={11} /> : index + 1}
									</span>
									<Link to={APP_ROUTES.venue(venue.slug)} className={styles.venueName}>
										{venue.name}
									</Link>
									<span className={styles.statValue}>{venue[key as StatKey]?.toLocaleString()}</span>
								</li>
							);
						})}
					</ol>
				</Card>
			))}
		</aside>
	);
};

export default VenueLeaders;
