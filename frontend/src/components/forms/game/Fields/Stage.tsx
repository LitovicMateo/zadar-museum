import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { GameFormData } from '@/schemas/GameSchema';

const stageOptions: OptionType[] = [
	{ label: 'League', value: 'league' },
	{ label: 'Group Stage', value: 'group' },
	{ label: 'Playoff', value: 'playoff' }
];

const Stage: React.FC = () => {
	const { control } = useFormContext<GameFormData>();
	return (
		<Controller
			control={control}
			name={'stage'}
			render={({ field }) => (
				<Select<OptionType, false>
					className="rounded-md text-xs text-gray-500"
					placeholder={'Select stage'}
					options={stageOptions}
					value={stageOptions.find((opt) => opt.value === field.value)}
					onChange={(opt) => field.onChange(opt?.value)}
					isClearable
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default Stage;
