import React, { useMemo } from 'react';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { ALL_COMPETITIONS } from '@/context/GamesUtils';
import { TeamCompetitionsResponse } from '@/types/api/Team';

type CompetitionDropdownProps = {
	competitions: TeamCompetitionsResponse[] | undefined;
	/** Either ALL_COMPETITIONS or a league_id. */
	selected: string;
	onChange: (value: string) => void;
};

const CompetitionDropdown: React.FC<CompetitionDropdownProps> = ({ competitions, selected, onChange }) => {
	const options: OptionType[] = useMemo(() => {
		const base: OptionType[] = [{ value: ALL_COMPETITIONS, label: 'All competitions' }];
		for (const c of competitions ?? []) {
			base.push({ value: String(c.league_id), label: c.league_name });
		}
		return base;
	}, [competitions]);

	return (
		<Select<OptionType, false>
			value={options.find((o) => o.value === selected) ?? options[0]}
			options={options}
			onChange={(opt) => opt && onChange(String(opt.value))}
			styles={selectStyle('240px')}
			isSearchable={false}
			placeholder="Competition"
			menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
			menuPosition="fixed"
			menuPlacement="auto"
		/>
	);
};

export default CompetitionDropdown;
