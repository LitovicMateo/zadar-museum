import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { PlayerFormData } from '@/schemas/PlayerSchema';

import { PositionOption, positionOptions } from '../Constants/PlayerPositions';
import styles from '@/components/forms/shared/FormLabel.module.css';

export const SecondaryPosition: React.FC = () => {
	const { control, watch } = useFormContext<PlayerFormData>();

	const primaryPosition = watch('primary_position');

	return (
		<label>
			<span className={styles.label}>Secondary Position: </span>
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
