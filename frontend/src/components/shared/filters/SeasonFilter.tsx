import React from 'react';
import AppSelect from '@/components/forms/shared/AppSelect';

import FilterField from '@/components/Stats/UI/FilterField';
import { selectStyle } from '@/constants/ReactSelectStyle';

type SeasonFilterProps = {
	seasons: string[];
	season: string | null;
	onSeasonChange: (season: string) => void;
};

const SeasonFilter: React.FC<SeasonFilterProps> = ({ seasons, season, onSeasonChange }) => {
	const seasonOptions: { label: string; value: string }[] = [
		{ label: 'All Seasons', value: 'all' },
		...seasons.map((s) => ({ label: s, value: s }))
	];

	return (
		<FilterField>
			<AppSelect
				styles={selectStyle()}
				value={seasonOptions.find((opt) => opt.value === season) ?? null}
				onChange={(opt) => onSeasonChange((opt?.value as string) ?? 'all')}
				options={seasonOptions}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
				placeholder="Season"
				aria-label="Season"
			/>
		</FilterField>
	);
};

export default SeasonFilter;
