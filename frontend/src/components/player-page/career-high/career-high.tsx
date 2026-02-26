import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { StatCardSkeleton } from '@/components/ui/skeletons';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { usePlayerCareerHigh } from '@/hooks/queries/player/usePlayerCareerHigh';
import { PlayerCareerHighResponse } from '@/types/api/player';
import { usePlayerHasAppearances } from '@/utils/playerHasAppearances';

import CareerHighRow from './career-high-row';

const careerHighData: {
	label: string;
	key: keyof PlayerCareerHighResponse;
}[] = [
	{
		label: 'Points',
		key: 'points'
	},
	{
		label: 'Rebounds',
		key: 'rebounds'
	},
	{
		label: 'Assists',
		key: 'assists'
	},
	{
		label: 'Steals',
		key: 'steals'
	},
	{
		label: 'Blocks',
		key: 'blocks'
	},
	{
		label: 'Field Goals Made',
		key: 'field_goals_made'
	},
	{
		label: 'Three Pointers Made',
		key: 'three_pointers_made'
	},
	{
		label: 'Free Throws Made',
		key: 'free_throws_made'
	},
	{
		label: 'Efficiency',
		key: 'efficiency'
	}
];

const CareerHigh: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data: careerHigh, isLoading } = usePlayerCareerHigh(playerId!, selectedDatabase);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	if (isLoading || !careerHigh) {
		return (
			<div className="flex flex-col gap-4 font-abel">
				<Heading title="Career High" />
				<div className="rounded-lg shadow-md border border-gray-200 overflow-hidden bg-white">
					<div className="flex justify-between px-4 py-3 font-semibold bg-slate-100 border-b-2 border-blue-500">
						<span className="text-gray-700">Statistic</span>
						<span className="text-gray-700">Record</span>
					</div>
					{Array.from({ length: 9 }).map((_, i) => (
						<StatCardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 font-abel" aria-labelledby="career-high-heading">
			<Heading title="Career High" id="career-high-heading" />
			<div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
				<ul className="font-abel text-lg min-w-[280px]" role="table" aria-label="Career high statistics">
					<li
						className="flex justify-between px-4 py-3 font-semibold bg-slate-100 border-b-2 border-blue-500"
						role="row"
					>
						<span role="columnheader" className="text-gray-700">
							Statistic
						</span>
						<span className="text-right text-gray-700" role="columnheader">
							Record
						</span>
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
