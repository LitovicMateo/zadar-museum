import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
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

const CareerHigh: React.FC = () => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data: careerHigh, isLoading } = usePlayerCareerHigh(playerId!, selectedDatabase);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	if (isLoading || !careerHigh) {
		return <div>Loading.....</div>;
	}

	return (
		<div className="flex flex-col gap-4 font-abel">
			<Heading title="Career High" />
			<div>
				<ul className="font-abel text-xl">
					<li className="flex justify-between border-b-1 border-solid border-gray-500 px-2 py-2 font-semibold bg-slate-100">
						<span>Statistic</span>
						<span>Record</span>
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
};

export default CareerHigh;
