import React from 'react';

import Heading from '@/components/ui/heading';

import Boxscore from './boxscore/boxscore';
import BoxscoreFilter from './filter/boxscore-filter';
import SeasonAverage from './season-average/season-average';

const PlayerBoxscore: React.FC = () => {
	return (
		<section className="flex flex-col gap-4 min-h-[500px]">
			<Heading title="Seasonal Data" />
			<BoxscoreFilter />
			<Heading title="Season Stats" type="secondary" />
			<SeasonAverage />
			<Heading title="Gamelog" type="secondary" />
			<Boxscore />
		</section>
	);
};

export default PlayerBoxscore;
