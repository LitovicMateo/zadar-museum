import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/CountrySelect';
import { RefereeFormData } from '@/schemas/RefereeSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const Nationality: React.FC = () => {
	const { control, register } = useFormContext<RefereeFormData>();

	React.useEffect(() => {
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
						onChange={(value) => {
							field.onChange(value);
						}}
						selectedValue={field.value}
					/>
				)}
			/>
		</label>
	);
};

export default Nationality;
