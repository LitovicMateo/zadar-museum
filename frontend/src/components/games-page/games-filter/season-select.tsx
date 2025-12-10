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
	compact?: boolean;
};

const SeasonSelect: React.FC<SeasonSelectProps> = ({ seasons, selectedSeason, onSeasonChange, compact = false }) => {
	const options: SeasonOption[] = seasons.map((s) => ({ value: s, label: s }));
	const selectedOption = options.find((o) => o.value === selectedSeason) ?? null;

	if (compact) {
		return (
			<div className="min-w-[150px] flex items-center gap-2">
				<label className="text-sm text-gray-600 font-medium">Season</label>
				<Select<SeasonOption, false>
					placeholder="Select season"
					value={selectedOption}
					options={options}
					onChange={(opt) => onSeasonChange?.(opt?.value ?? '')}
					className="text-sm"
					classNamePrefix="rs"
					styles={selectStyle('160px')}
					menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
					menuPosition="fixed"
					isSearchable={false}
					menuPlacement="auto"
				/>
			</div>
		);
	}

	return (
		<div className="min-w-[150px]">
			<label className="block text-xs text-gray-600 mb-1 font-medium">Season</label>
			<Select<SeasonOption, false>
				placeholder="Select season"
				value={selectedOption}
				options={options}
				onChange={(opt) => onSeasonChange?.(opt?.value ?? '')}
				className="text-sm"
				classNamePrefix="rs"
				styles={selectStyle('180px')}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				isSearchable={false}
				menuPlacement="auto"
			/>
		</div>
	);
};

export default SeasonSelect;
