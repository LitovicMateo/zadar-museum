import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useCoaches } from '@/hooks/queries/coach/useCoaches';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

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
		<Controller
			name="assistantCoachId"
			control={control}
			render={({ field }) => (
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
			)}
		/>
	);
};

export default AssistantCoach;
