import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useCoaches } from '@/hooks/queries/coach/UseCoaches';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const AssistantCoach: React.FC = () => {
	const { watch, control, setValue } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	const headCoach = watch('coachId');

	const { data: coaches } = useCoaches('last_name', 'asc');

	React.useEffect(() => {
		if (!game) {
			setValue('assistantCoachId', '');
		}
	}, [game, setValue]);

	const assistantOptions: OptionType[] =
		coaches
			?.filter((coach) => coach.id !== +headCoach)
			.map((coach) => ({
				value: coach.id.toFixed(),
				label: coach.last_name + ' ' + coach.first_name
			})) || [];

	return (
		<FormField
			control={control}
			name="assistantCoachId"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Assistant Coach</FormLabel>
					<FormControl>
						<Select
							name={field.name}
							onBlur={field.onBlur}
							onChange={(selected) => field.onChange(selected ? selected.value : '')}
							value={assistantOptions.find((option) => option.value === field.value) ?? null}
							isDisabled={!headCoach || !game}
							isClearable
							placeholder="Select Assistant Coach"
							options={assistantOptions}
							styles={selectStyle()}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default AssistantCoach;
