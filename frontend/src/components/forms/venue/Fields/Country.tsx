import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/country-select';
import { VenueFormData } from '@/schemas/venue-schema';

const Country: React.FC = () => {
	const { control, register } = useFormContext<VenueFormData>();

	React.useEffect(() => {
		register('country', { required: 'Country is required' });
	}, [register]);

	return (
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
	);
};

export default Country;
