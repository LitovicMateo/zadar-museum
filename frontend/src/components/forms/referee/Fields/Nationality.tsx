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
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Nationality: <span className="text-red-500">*</span>
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
