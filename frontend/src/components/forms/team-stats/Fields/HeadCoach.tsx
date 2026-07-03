import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useCoaches } from '@/hooks/queries/coach/UseCoaches';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const HeadCoach: React.FC = () => {
	const { control, watch, setValue } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	const headCoach = watch('coachId');

	const { data: coaches } = useCoaches('last_name', 'asc');

	React.useEffect(() => {
		if (!game) {
			setValue('coachId', '');
		}
	}, [game, setValue]);

	React.useEffect(() => {
		if (!headCoach) {
			setValue('assistantCoachId', '');
		}
	}, [headCoach, setValue]);

	if (!coaches) return null;

	const options: OptionType[] = coaches?.map((coach) => ({
		value: coach.id.toString(),
		label: coach.last_name + ' ' + coach.first_name
	}));

	return (
		<FormField
			control={control}
			name="coachId"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Head Coach</FormLabel>
					<FormControl>
						<AppSelect
							name={field.name}
							onBlur={field.onBlur}
							onChange={(selected) => field.onChange(selected ? selected.value : '')}
							value={options.find((option) => option.value === field.value) ?? null}
							isDisabled={!game}
							isClearable
							placeholder="Select Coach"
							options={options}
							styles={selectStyle()}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default HeadCoach;
