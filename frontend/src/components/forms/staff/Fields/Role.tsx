import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { StaffFormData } from '@/schemas/StaffSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const options: OptionType[] = [
	{ value: 'Assistant coach', label: 'Assistant Coach' },
	{ value: 'Fitness coach', label: 'Fitness Coach' },
	{ value: 'Doctor', label: 'Doctor' },
	{ value: 'Physio', label: 'Physio' }
];

const Role: React.FC = () => {
	const { control } = useFormContext<StaffFormData>();

	return (
		<FormField
			control={control}
			name="role"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Role <span className="text-destructive text-xs">*</span></FormLabel>
					<FormControl>
						<Select
							{...field}
							styles={selectStyle()}
							options={options}
							onChange={(selected) =>
								field.onChange(selected ? (selected.value as StaffFormData['role']) : '')
							}
							value={options.find((opt) => opt.value === field.value) || null}
							isClearable={false}
							placeholder="Select Role"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default Role;
