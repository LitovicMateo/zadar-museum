import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface OptionType {
	value: string;
	label: string;
}

const Competition: React.FC = () => {
	const { control, setValue } = useFormContext<GameFormData>();
	const { data: competitions } = useCompetitions('slug', 'asc');

	if (!competitions) return null;

	const competitionOptions: OptionType[] = competitions.map((c) => ({
		value: c.id.toString(),
		label: c.name
	}));
	return (
		<FormField
			control={control}
			name="competition"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Competition</FormLabel>
					<FormControl>
						<AppSelect<OptionType, false>
							placeholder="Select competition"
							options={competitionOptions}
							value={competitionOptions.find((opt) => opt.value === field.value)}
							onChange={(option) => {
								field.onChange(option?.value);
								setValue('league_name', '');
								setValue('league_short_name', '');
							}}
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

export default Competition;
