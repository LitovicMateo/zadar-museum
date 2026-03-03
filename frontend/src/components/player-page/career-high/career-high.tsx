import React from 'react';
import { useParams } from 'react-router-dom';

import { StatCardSkeleton } from '@/components/ui/skeletons';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { usePlayerCareerHigh } from '@/hooks/queries/player/usePlayerCareerHigh';
import { PlayerCareerHighResponse } from '@/types/api/player';
import { usePlayerHasAppearances } from '@/utils/playerHasAppearances';

import CareerHighRow from './career-high-row';
import styles from './career-high.module.css';

const careerHighData: {
	label: string;
	key: keyof PlayerCareerHighResponse;
}[] = [
	{ label: 'Points', key: 'points' },
	{ label: 'Rebounds', key: 'rebounds' },
	{ label: 'Assists', key: 'assists' },
	{ label: 'Steals', key: 'steals' },
	{ label: 'Blocks', key: 'blocks' },
	{ label: 'Field Goals Made', key: 'field_goals_made' },
	{ label: 'Three Pointers Made', key: 'three_pointers_made' },
	{ label: 'Free Throws Made', key: 'free_throws_made' },
	{ label: 'Efficiency', key: 'efficiency' },
];

const CareerHigh: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data: careerHigh, isLoading } = usePlayerCareerHigh(playerId!, selectedDatabase);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	if (isLoading || !careerHigh) {
		return (
			<div className={styles.section}>
				<div className={styles.tableWrapper}>
					<ul className={styles.list} role="table" aria-label="Career high statistics">
						<li className={styles.listHead} role="row">
							<span role="columnheader" className={styles.listHeadLabel}>Statistic</span>
							<span role="columnheader" className={styles.listHeadLabel}>Record</span>
						</li>
						{Array.from({ length: 9 }).map((_, i) => (
							<StatCardSkeleton key={i} />
						))}
					</ul>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.section}>
			<div className={styles.tableWrapper}>
				<ul className={styles.list} role="table" aria-label="Career high statistics">
					<li className={styles.listHead} role="row">
						<span role="columnheader" className={styles.listHeadLabel}>Statistic</span>
						<span className={styles.listHeadLabel} role="columnheader">Record</span>
					</li>
					{careerHighData.map((stat, index) => {
						const value = careerHigh[stat.key];
						const isLast = index === careerHighData.length - 1;

						if (typeof value === 'string' || value == null) return null;

						return <CareerHighRow key={stat.key} label={stat.label} stat={value} isLastItem={isLast} />;
					})}
				</ul>
			</div>
		</div>
	);
});
CareerHigh.displayName = 'CareerHigh';

export default CareerHigh;
