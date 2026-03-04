import React from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
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
				<div className={styles.grid}>
					{Array.from({ length: 9 }).map((_, i) => (
						<div key={i} className={styles.skeletonCard}>
							<Skeleton style={{ width: '55%', height: '11px', borderRadius: '4px' }} />
							<Skeleton style={{ width: '40%', height: '40px', borderRadius: '6px' }} />
							<Skeleton style={{ width: '70%', height: '11px', borderRadius: '4px' }} />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.section}>
			<div className={styles.grid} aria-label="Career high statistics">
				{careerHighData.map((stat) => {
					const value = careerHigh[stat.key];

					if (typeof value === 'string' || value == null) return null;

					return <CareerHighRow key={stat.key} label={stat.label} stat={value} />;
				})}
			</div>
		</div>
	);
});
CareerHigh.displayName = 'CareerHigh';

export default CareerHigh;

