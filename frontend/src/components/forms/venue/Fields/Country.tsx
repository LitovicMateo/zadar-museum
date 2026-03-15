import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/CountrySelect';
import { VenueFormData } from '@/schemas/VenueSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const Country: React.FC = () => {
	const { control, register } = useFormContext<VenueFormData>();

	React.useEffect(() => {
		register('country', { required: 'Country is required' });
	}, [register]);

	return (
		<label>
			<span className={styles.label}>
				Country: <span className={styles.required}>*</span>
			</span>
			<Controller
				control={control}
				name="country"
				render={({ field }) => (
					<CountrySelect
						{...field}
						selectedValue={(field.value as string) || ''}
						onChange={(value) => field.onChange(value)}
					/>
				)}
			/>
		</label>
	);
};

export default Country;
