import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/country-select';
import { TeamFormData } from '@/schemas/team-schema';

const Country = () => {
	const { control, register } = useFormContext<TeamFormData>();

	React.useEffect(() => {
		register('country', { required: 'Country is required' });
	}, [register]);
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Country: <span className="text-red-500">*</span>
			</span>
			<Controller
				control={control}
				name="country"
				render={({ field }) => (
					<CountrySelect
						{...field}
						selectedValue={field.value}
						onChange={(value) => {
							field.onChange(value);
						}}
					/>
				)}
			/>
		</label>
	);
};

export default Country;
