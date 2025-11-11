import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { StaffFormData } from '@/schemas/staff-schema';

const options: OptionType[] = [
	{ value: 'Assistant coach', label: 'Assistant Coach' },
	{ value: 'Fitness coach', label: 'Fitness Coach' },
	{ value: 'Doctor', label: 'Doctor' },
	{ value: 'Physio', label: 'Physio' }
];

const Role: React.FC = () => {
	const { control } = useFormContext<StaffFormData>();

	return (
		<Controller
			name="role"
			control={control}
			render={({ field }) => (
				<Select
					{...field}
					styles={selectStyle()}
					options={options}
					onChange={(selected) => field.onChange(selected ? (selected.value as StaffFormData['role']) : '')}
					value={options.find((opt) => opt.value === field.value) || null}
					isClearable={false}
					placeholder="Select Role"
				/>
			)}
		/>
	);
};

export default Role;
