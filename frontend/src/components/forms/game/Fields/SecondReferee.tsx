import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useReferees } from '@/hooks/queries/referee/UseReferees';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const SecondReferee: React.FC = () => {
	const { control, watch } = useFormContext<GameFormData>();

	const mainReferee = watch('mainReferee') ?? '';

	const { data: referees } = useReferees('last_name', 'asc');

	if (!referees) return null;

	const refereeOptions: OptionType[] = referees
		.filter((ref) => ref.id !== Number(mainReferee))
		.map((ref) => ({
			label: `${ref.first_name} ${ref.last_name}`,
			value: ref.id.toString()
		}));

	return (
		<FormField
			control={control}
			name="secondReferee"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Referee #2</FormLabel>
					<FormControl>
						<AppSelect
							placeholder="Select Referee #2"
							options={refereeOptions}
							value={refereeOptions.find((opt) => opt.value === field.value)}
							onChange={(opt) => field.onChange(opt?.value)}
							isClearable
							isDisabled={!mainReferee}
							styles={selectStyle()}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default SecondReferee;
