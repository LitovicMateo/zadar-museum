import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { PlayerFormData } from '@/schemas/PlayerSchema';

import { PositionOption, positionOptions } from '../Constants/PlayerPositions';
import styles from '@/components/forms/shared/FormLabel.module.css';

const PrimaryPosition: React.FC = () => {
	const { control } = useFormContext<PlayerFormData>();
	return (
		<label>
			<span className={styles.label}>
				Primary Position: <span className={styles.required}>*</span>
			</span>
			<Controller
				control={control}
				name="primary_position"
				// primary position is now optional/nullable
				render={({ field }) => (
					<Select<PositionOption, false>
						options={positionOptions}
						value={positionOptions.find((opt) => opt.value === field.value) || null}
						onChange={(selected) => field.onChange(selected?.value ?? null)}
						isClearable
						styles={selectStyle()}
					/>
				)}
			/>
		</label>
	);
};

export default PrimaryPosition;
