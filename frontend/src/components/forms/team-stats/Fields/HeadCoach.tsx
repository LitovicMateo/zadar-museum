import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useCoaches } from '@/hooks/queries/coach/useCoaches';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

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
		<Controller
			name="coachId"
			control={control}
			render={({ field }) => (
				<Select
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
			)}
		/>
	);
};

export default HeadCoach;
