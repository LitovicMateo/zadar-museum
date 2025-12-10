import React from 'react';

import SeasonSelect from '@/components/games-page/games-filter/season-select';

interface Props {
	seasons: string[];
	selectedSeason: string | null;
	onSeasonChange?: (s: string) => void;
	compact?: boolean;
}

const RightControls: React.FC<Props> = ({ seasons, selectedSeason, onSeasonChange, compact = false }) => {
	return (
		<div className="flex items-center gap-2 mt-2 sm:mt-0">
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
