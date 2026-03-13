import React from 'react';

import BoxscoreFilter from '@/components/Player/Content/PlayerBoxscore/filter/BoxscoreFilter';
import SeasonAverage from '@/components/Player/Content/PlayerBoxscore/season-average/SeasonAverage';
import { TabsContent } from '@/components/ui/Tabs';

import styles from './player-content.module.css';

const SeasonTab: React.FC = () => (
	<TabsContent value="season" className={styles.tabsContent}>
		<BoxscoreFilter />
		<SeasonAverage />
	</TabsContent>
);

export default SeasonTab;
