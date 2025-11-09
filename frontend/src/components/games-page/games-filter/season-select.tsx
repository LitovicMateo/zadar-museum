import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';

export type SeasonOption = {
	value: string;
	label: string;
};

type SeasonSelectProps = {
	seasons: string[];
	selectedSeason: string | null;
	onSeasonChange?: (season: string) => void;
};

const SeasonSelect: React.FC<SeasonSelectProps> = ({ seasons, selectedSeason, onSeasonChange }) => {
	const options: SeasonOption[] = seasons.map((s) => ({ value: s, label: s }));
	const selectedOption = options.find((o) => o.value === selectedSeason) ?? null;

	return (
		<Select<SeasonOption, false>
			placeholder="Season"
			value={selectedOption}
			options={options}
			onChange={(opt) => onSeasonChange?.(opt?.value ?? '')}
			className="text-sm shadow-sm"
			styles={selectStyle()}
		/>
	);
};

export default SeasonSelect;
