import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';

import { coachOptions, playerOptions } from './options';

type CategorySelectProps = {
	selected: 'player' | 'coach';
	stat: string | null;
	setStat: React.Dispatch<React.SetStateAction<string | null>>;
};

const CategorySelect: React.FC<CategorySelectProps> = ({ selected, stat, setStat }) => {
	const options = selected === 'player' ? playerOptions : coachOptions;

	return (
		<Select
			placeholder="Statistic"
			className="text-sm shadow-sm"
			options={options}
			value={options.find((option) => option.value === stat)}
			onChange={(option) => setStat(option?.value.toString() || '')}
			styles={selectStyle('fit-content')}
		/>
	);
};

export default CategorySelect;
