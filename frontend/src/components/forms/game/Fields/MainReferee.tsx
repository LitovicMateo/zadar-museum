import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useReferees } from '@/hooks/queries/referee/UseReferees';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const MainReferee: React.FC = () => {
	const { control } = useFormContext<GameFormData>();

	const { data: referees } = useReferees('last_name', 'asc');

	if (!referees) return null;

	const refereeOptions: OptionType[] = referees.map((ref) => ({
		label: `${ref.first_name} ${ref.last_name}`,
		value: ref.id.toString()
	}));

	return (
		<FormField
			control={control}
			name="mainReferee"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Referee #1</FormLabel>
					<FormControl>
						<Select
							placeholder="Select Referee #1"
							options={refereeOptions}
							value={refereeOptions.find((opt) => opt.value === field.value)}
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

export default MainReferee;
