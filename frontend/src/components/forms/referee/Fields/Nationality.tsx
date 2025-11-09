import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/country-select';
import { RefereeFormData } from '@/schemas/referee-schema';

const Nationality: React.FC = () => {
	const { control, register } = useFormContext<RefereeFormData>();

	React.useEffect(() => {
		register('nationality', { required: 'Nationality is required' });
	}, [register]);

	return (
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
	);
};

export default Nationality;
