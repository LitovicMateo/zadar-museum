import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { PlayerFormData } from '@/schemas/player-schema';

import { PositionOption, positionOptions } from '../Constants/player-positions';

export const SecondaryPosition: React.FC = () => {
	const { control, watch } = useFormContext<PlayerFormData>();

	const primaryPosition = watch('primary_position');

	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">Secondary Position: </span>
			<Controller
				control={control}
				name="secondary_position"
				render={({ field }) => (
					<Select<PositionOption, false>
						options={positionOptions}
						value={positionOptions.find((opt) => opt.value === field.value) || null}
						onChange={(selected) => field.onChange(selected?.value ?? null)}
						isDisabled={!primaryPosition}
						isClearable
						styles={selectStyle()}
					/>
				)}
			/>
		</label>
	);
};
