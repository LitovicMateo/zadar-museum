import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle, OptionType } from '@/constants/react-select-style';
import { useTeams } from '@/hooks/queries/team/useTeams';
import { GameFormData } from '@/schemas/game-schema';

const AwayTeam: React.FC = () => {
	const { control, setValue, watch } = useFormContext<GameFormData>();

	const { data: teams } = useTeams('slug', 'asc');

	if (!teams) return null;

	const teamOptions: OptionType[] = teams.map((team) => ({
		value: team.id.toString(),
		label: team.name
	}));

	const homeTeam = watch('home_team');
	const homeTeamName = watch('home_team_name');
	return (
		<Controller
			control={control}
			name="away_team"
			render={({ field }) => (
				<Select<OptionType, false>
					className="rounded-md text-gray-500 placeholder:text-xs text-xs"
					onChange={(option) => {
						field.onChange(option?.value);
						setValue('away_team_name', '');
						setValue('away_team_short_name', '');
					}}
					value={field.value ? teamOptions.find((opt) => opt.value === field.value) : null}
					options={teamOptions.filter((opt) => opt.value !== homeTeam)}
					isDisabled={!homeTeamName}
					isClearable
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default AwayTeam;
