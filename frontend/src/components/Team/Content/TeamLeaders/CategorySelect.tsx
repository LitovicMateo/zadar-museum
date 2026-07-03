import React from 'react';
import AppSelect from '@/components/forms/shared/AppSelect';

import { selectStyle } from '@/constants/ReactSelectStyle';

import { coachOptions, playerOptions } from './Options';

type CategorySelectProps = {
	selected: 'player' | 'coach';
	stat: string | null;
	setStat: React.Dispatch<React.SetStateAction<string | null>>;
};

const CategorySelect: React.FC<CategorySelectProps> = ({ selected, stat, setStat }) => {
	const options = selected === 'player' ? playerOptions : coachOptions;

	return (
		<AppSelect
			placeholder="Statistic"
			className="text-sm"
			options={options}
			value={options.find((option) => option.value === stat)}
			onChange={(option) => setStat(option?.value.toString() || '')}
			styles={selectStyle()}
		/>
	);
};

export default CategorySelect;
