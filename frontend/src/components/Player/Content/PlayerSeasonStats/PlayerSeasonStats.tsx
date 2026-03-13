import React from 'react';

import BoxscoreFilter from '@/components/Player/Content/PlayerBoxscore/filter/BoxscoreFilter';
import SeasonAverage from '@/components/Player/Content/PlayerBoxscore/season-average/SeasonAverage';

import styles from './PlayerSeasonStats.module.css';

const SeasonTab: React.FC = () => (
	<div className={styles.wrapper}>
		<BoxscoreFilter />
		<SeasonAverage />
	</div>
);

export default SeasonTab;
