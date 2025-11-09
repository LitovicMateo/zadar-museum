import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useSeasonCompetitions } from '@/hooks/queries/dasboard/useSeasonCompetitions';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

const Competition: React.FC = () => {
	const { watch, control, setValue } = useFormContext<TeamStatsFormData>();

	const season = watch('season');

	const { data: competitions } = useSeasonCompetitions(season);

	const competitionsOptions: OptionType[] =
		competitions?.map((c) => ({
			value: c.league_id,
			label: c.league_name
		})) || [];

	return (
		<Controller
			control={control}
			name="league"
			render={({ field }) => (
				<Select
					value={competitionsOptions.find((option) => option.value === field.value) || null}
					onChange={(option) => {
						field.onChange(option?.value || '');
						setValue('gameId', '');
						setValue('teamId', '');
					}}
					placeholder="Select Competition"
					options={competitionsOptions}
					isClearable
					isDisabled={!season}
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default Competition;
