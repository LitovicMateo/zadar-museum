import React from 'react';

import Heading from '@/components/ui/heading';

import Boxscore from './boxscore/boxscore';
import BoxscoreFilter from './filter/boxscore-filter';
import SeasonAverage from './season-average/season-average';
import styles from './player-boxscore.module.css';

const PlayerBoxscore: React.FC = () => {
	return (
		<section className={styles.section}>
			<BoxscoreFilter />
			<Heading title="Season Stats" type="secondary" />
			<SeasonAverage />
			<Heading title="Gamelog" type="secondary" />
			<Boxscore />
		</section>
	);
};

export default PlayerBoxscore;
