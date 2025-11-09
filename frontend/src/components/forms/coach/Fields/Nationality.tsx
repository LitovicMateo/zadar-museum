import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/country-select';
import { CoachFormData } from '@/schemas/coach-schema';

const Nationality: React.FC = () => {
	const { control, register } = useFormContext<CoachFormData>();

	useEffect(() => {
		register('nationality', { required: 'Nationality is required' });
	}, [register]);

	return (
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
	);
};

export default Nationality;
