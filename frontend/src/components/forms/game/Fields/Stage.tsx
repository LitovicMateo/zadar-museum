import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const stageOptions: OptionType[] = [
	{ label: 'League', value: 'league' },
	{ label: 'Group Stage', value: 'group' },
	{ label: 'Playoff', value: 'playoff' }
];

const Stage: React.FC = () => {
	const { control } = useFormContext<GameFormData>();
	return (
		<FormField
			control={control}
			name="stage"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Stage</FormLabel>
					<FormControl>
						<Select<OptionType, false>
							placeholder="Select stage"
							options={stageOptions}
							value={stageOptions.find((opt) => opt.value === field.value)}
							onChange={(opt) => field.onChange(opt?.value)}
							isClearable
							styles={selectStyle()}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default Stage;
