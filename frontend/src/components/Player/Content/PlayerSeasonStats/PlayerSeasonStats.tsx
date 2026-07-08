import React from 'react';

import BoxscoreFilter from '@/components/Player/Content/PlayerBoxscore/filter/BoxscoreFilter';
import SeasonAverage from '@/components/Player/Content/PlayerBoxscore/season-average/SeasonAverage';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';

import PlayerSeasonRecords from './PlayerSeasonRecords';

const SeasonTab: React.FC = () => (
	<section className="space-y-4">
		<MobileFilterSheet title="Filter season">
			<BoxscoreFilter />
		</MobileFilterSheet>
		<SeasonAverage />
		<PlayerSeasonRecords />
	</section>
);

export default SeasonTab;
