import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { PlayerFormData } from '@/schemas/player-schema';

import { PositionOption, positionOptions } from '../Constants/player-positions';

const PrimaryPosition: React.FC = () => {
	const { control } = useFormContext<PlayerFormData>();
	return (
		<Controller
			control={control}
			name="primary_position"
			rules={{ required: 'Position is required' }}
			render={({ field }) => (
				<Select<PositionOption, false>
					options={positionOptions}
					value={positionOptions.find((opt) => opt.value === field.value) || null}
					onChange={(selected) => field.onChange(selected?.value || '')}
					isClearable
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default PrimaryPosition;
