import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle, OptionType } from '@/constants/ReactSelectStyle';
import { useTeams } from '@/hooks/queries/team/UseTeams';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

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
		<FormField
			control={control}
			name="away_team"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Away Team</FormLabel>
					<FormControl>
						<Select<OptionType, false>
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
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default AwayTeam;
