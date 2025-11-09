import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/country-select';
import { PlayerFormData } from '@/schemas/player-schema';

const Nationality = () => {
	const { control, setValue, register, watch } = useFormContext<PlayerFormData>();

	React.useEffect(() => {
		register('nationality', { required: 'Nationality is required' });
	}, [setValue, register]);
	return (
		<Controller
			control={control}
			name="nationality"
			rules={{ required: 'Nationality is required' }}
			render={() => (
				<CountrySelect
					selectedValue={watch('nationality')}
					onChange={(value) => setValue('nationality', value)}
				/>
			)}
		/>
	);
};

export default Nationality;
