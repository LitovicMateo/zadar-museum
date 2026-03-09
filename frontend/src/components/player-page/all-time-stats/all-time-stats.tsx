import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';

import styles from './all-time-stats.module.css';

const statsConfig = [
	{ label: 'Games', key: 'games' as const, rankKey: 'games_rank' as const },
	{ label: 'Points', key: 'points' as const, rankKey: 'points_rank' as const },
	{ label: 'Rebounds', key: 'rebounds' as const, rankKey: 'rebounds_rank' as const },
	{ label: 'Assists', key: 'assists' as const, rankKey: 'assists_rank' as const },
	{ label: '3PT', key: 'three_pointers_made' as const, rankKey: 'three_pointers_made_rank' as const },
	{ label: 'FT', key: 'free_throws_made' as const, rankKey: 'free_throws_made_rank' as const }
];

const AllTimeStats: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data, isLoading } = useAllTimeStats(playerId!, selectedDatabase!);

	const [location, setLocation] = useState<'total' | 'home' | 'away' | 'neutral'>('total');
	const hasNeutral = !!(data?.[0]?.total?.neutral?.games);

	useEffect(() => {
		if (!hasNeutral && location === 'neutral') setLocation('total');
	}, [hasNeutral, location]);

	if (isLoading || !data) {
		return (
			<section className={styles.section}>
				<fieldset className={styles.filterBar}>
					{(['total', 'home', 'away', 'neutral'] as const).map((loc) => (
						<Skeleton key={loc} style={{ width: '60px', height: '28px', borderRadius: '9999px' }} />
					))}
				</fieldset>
				<div className={styles.grid}>
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className={styles.cellSkeleton}>
							<Skeleton style={{ width: '60px', height: '36px', borderRadius: '6px' }} />
							<Skeleton style={{ width: '50px', height: '12px', borderRadius: '4px' }} />
						</div>
					))}
				</div>
			</section>
		);
	}

	const totalStats = data[0].total[location] ?? data[0].total.total;

	return (
		<section className={styles.section}>
			<fieldset className={styles.filterBar} aria-label="Location filter">
				{(['total', 'home', 'away', 'neutral'] as const).map((loc) => (
					<button
						key={loc}
						type="button"
						role="radio"
						aria-checked={location === loc}
						disabled={loc === 'neutral' && !hasNeutral}
						onClick={() => setLocation(loc)}
						className={[
							styles.pill,
							location === loc ? styles.pillActive : '',
							loc === 'neutral' && !hasNeutral ? styles.pillDisabled : '',
						].filter(Boolean).join(' ')}
					>
						{loc}
					</button>
				))}
			</fieldset>
			<div className={styles.grid} aria-label="Career statistics">
				{statsConfig.map((stat) => (
					<div key={stat.key} className={styles.cell}>
						{totalStats[stat.rankKey] != null && (
							<span className={styles.rankBadge}>#{totalStats[stat.rankKey]}</span>
						)}
						<span className={styles.cellValue}>{totalStats[stat.key] ?? '-'}</span>
						<span className={styles.cellLabel}>{stat.label}</span>
					</div>
				))}
			</div>
		</section>
	);
});

AllTimeStats.displayName = 'AllTimeStats';

export default AllTimeStats;

