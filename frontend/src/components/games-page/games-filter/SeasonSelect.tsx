import React, { useMemo } from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { useSeasonTransition } from '@/hooks/UseSeasonTransition';
import styles from './SeasonSelect.module.css';

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
			<div className={styles.wrapperCompact} style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}>
				<label className={styles.labelCompact}>Season</label>
				<Select<SeasonOption, false> {...selectProps} styles={selectStyle('160px')} />
			</div>
		);
	}

	return (
		<div className={styles.wrapper} style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}>
			<label className={styles.label}>Season</label>
			<Select<SeasonOption, false> {...selectProps} styles={selectStyle('180px')} />
		</div>
	);
};

export default SeasonSelect;
