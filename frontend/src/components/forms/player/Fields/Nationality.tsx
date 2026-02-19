import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/country-select';
import { PlayerFormData } from '@/schemas/player-schema';

const Nationality = () => {
	const { control, setValue, register, watch } = useFormContext<PlayerFormData>();

	React.useEffect(() => {
		// nationality is optional now
		register('nationality');
	}, [setValue, register]);
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Nationality:
			</span>
			<Controller
				control={control}
				name="nationality"
				render={() => (
					<CountrySelect
						selectedValue={watch('nationality')}
						onChange={(value) => setValue('nationality', value ?? null)}
					/>
				)}
			/>
		</label>
	);
};

export default Nationality;
