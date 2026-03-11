import React from 'react';

import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import styles from './RightControls.module.css';

interface Props {
	seasons: string[];
	selectedSeason: string | null;
	onSeasonChange?: (s: string) => void;
	compact?: boolean;
}

const RightControls: React.FC<Props> = ({ seasons, selectedSeason, onSeasonChange, compact = false }) => {
	return (
		<div className={styles.wrapper}>
			<SeasonSelect
				seasons={seasons ?? []}
				selectedSeason={selectedSeason}
				onSeasonChange={onSeasonChange}
				compact={compact}
			/>
		</div>
	);
};

export default RightControls;
