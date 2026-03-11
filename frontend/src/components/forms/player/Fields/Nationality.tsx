import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/country-select/CountrySelect';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const Nationality = () => {
	const { control, setValue, register, watch } = useFormContext<PlayerFormData>();

	React.useEffect(() => {
		// nationality is optional now
		register('nationality');
	}, [setValue, register]);
	return (
		<label>
			<span className={styles.label}>
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
