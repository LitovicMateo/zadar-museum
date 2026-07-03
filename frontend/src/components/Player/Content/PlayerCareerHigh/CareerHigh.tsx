import React from 'react';
import { useParams } from 'react-router-dom';

import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { Skeleton } from '@/components/UI/Skeleton';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { usePlayerCareerHigh } from '@/hooks/queries/player/UsePlayerCareerHigh';
import { PlayerCareerHighResponse } from '@/types/api/Player';
import { usePlayerHasAppearances } from '@/utils/PlayerHasAppearances';

import CareerHighRow from './CareerHighRow';

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
	{ label: 'Efficiency', key: 'efficiency' }
];

const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3';

const CareerHigh: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data: careerHigh, isLoading } = usePlayerCareerHigh(playerId!, selectedDatabase);
	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	if (isLoading || !careerHigh) {
		return (
			<div className={GRID}>
				{Array.from({ length: 9 }).map((_, i) => (
					<Skeleton key={i} className="h-28 rounded-xl" />
				))}
			</div>
		);
	}

	return (
		<DynamicContentWrapper>
			<div className={GRID} aria-label="Career high statistics">
				{careerHighData.map((stat) => {
					const value = careerHigh[stat.key];
					if (typeof value === 'string' || value == null) return null;
					return <CareerHighRow key={stat.key} label={stat.label} stat={value} />;
				})}
			</div>
		</DynamicContentWrapper>
	);
});
CareerHigh.displayName = 'CareerHigh';

export default CareerHigh;
