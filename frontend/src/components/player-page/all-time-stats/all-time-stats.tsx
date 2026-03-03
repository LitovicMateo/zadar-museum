import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { StatCardSkeleton } from '@/components/ui/skeletons';
import StatCard from '@/components/ui/stat-card';
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
				<div className={styles.table}>
					<div className={`${styles.tableHead} ${styles.tableHeadSkeleton}`}>
						<span className={styles.tableHeadLabel}>Statistic</span>
						<span className={styles.tableHeadLabel}>Record (Rank)</span>
					</div>
					{Array.from({ length: 6 }).map((_, i) => (
						<StatCardSkeleton key={i} />
					))}
				</div>
			</section>
		);
	}

	const totalStats = data[0].total[location] ?? data[0].total.total;

	return (
		<section className={styles.section}>
			<fieldset className={styles.filterRow}>
				{(['total', 'home', 'away', 'neutral'] as const).map((loc) => (
					<label
						key={loc}
						className={[
							styles.filterLabel,
							loc === 'neutral' && !hasNeutral ? styles.filterLabelDisabled : '',
						].join(' ')}
					>
						<input
							type="radio"
							name="all-time-stats-location"
							value={loc}
							checked={location === loc}
							onChange={() => setLocation(loc)}
							disabled={loc === 'neutral' && !hasNeutral}
							className={styles.filterRadio}
						/>
						<span className={styles.filterLabelText}>{loc}</span>
					</label>
				))}
			</fieldset>
			<div
				className={styles.table}
				role="table"
				aria-label="Career statistics"
			>
				<div
					className={styles.tableHead}
					role="row"
				>
					<span role="columnheader" className={styles.tableHeadLabel}>
						Statistic
					</span>
					<span role="columnheader" className={styles.tableHeadLabel}>
						Record (Rank)
					</span>
				</div>
				{statsConfig.map((stat) => (
					<div key={stat.key} role="row">
						<StatCard
							label={stat.label}
							value={totalStats[stat.key] ?? '-'}
							rank={(totalStats[stat.rankKey] ?? undefined) as number | undefined}
						/>
					</div>
				))}
			</div>
		</section>
	);
});

AllTimeStats.displayName = 'AllTimeStats';

export default AllTimeStats;
