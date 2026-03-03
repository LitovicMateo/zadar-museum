import React, { useMemo } from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { useSeasonTransition } from '@/hooks/useSeasonTransition';

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
	const { selectSeason, isPending } = useSeasonTransition(onSeasonChange ?? (() => {}));

	const options: SeasonOption[] = useMemo(() => seasons.map((s) => ({ value: s, label: s })), [seasons]);
	const selectedOption = options.find((o) => o.value === selectedSeason) ?? null;

	const selectProps = {
		placeholder: 'Select season',
		value: selectedOption,
		options,
		onChange: (opt: SeasonOption | null) => selectSeason(opt?.value ?? ''),
		className: 'text-sm',
		classNamePrefix: 'rs',
		menuPortalTarget: typeof document !== 'undefined' ? document.body : null,
		menuPosition: 'fixed' as const,
		isSearchable: false,
		menuPlacement: 'auto' as const,
	};

	if (compact) {
		return (
			<div className="min-w-[150px] flex items-center gap-2" style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}>
				<label className="text-sm text-gray-600 font-medium">Season</label>
				<Select<SeasonOption, false> {...selectProps} styles={selectStyle('160px')} />
			</div>
		);
	}

	return (
		<div className="min-w-[150px]" style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}>
			<label className="block text-xs text-gray-600 mb-1 font-medium">Season</label>
			<Select<SeasonOption, false> {...selectProps} styles={selectStyle('180px')} />
		</div>
	);
};

export default SeasonSelect;
