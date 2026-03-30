import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/CountrySelect/CountrySelect';
import { CoachFormData } from '@/schemas/CoachSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const Nationality: React.FC = () => {
	const { control, register } = useFormContext<CoachFormData>();

	useEffect(() => {
		register('nationality', { required: 'Nationality is required' });
	}, [register]);

	return (
		<label>
			<span className={styles.label}>
				Nationality: <span className={styles.required}>*</span>
			</span>
			<Controller
				control={control}
				name="nationality"
				render={({ field }) => (
					<CountrySelect
						{...field}
						onChange={(value) => field.onChange(value)}
						selectedValue={(field.value as string) || ''}
					/>
				)}
			/>
		</label>
	);
};

export default Nationality;
