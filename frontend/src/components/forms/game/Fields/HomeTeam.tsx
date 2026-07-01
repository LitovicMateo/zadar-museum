import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useTeams } from '@/hooks/queries/team/UseTeams';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const HomeTeam = () => {
	const { control, setValue, watch } = useFormContext<GameFormData>();
	const { data: teams } = useTeams('slug', 'asc');

	const homeTeam = watch('home_team');
	const awayTeam = watch('away_team');

	React.useEffect(() => {
		if (!homeTeam && awayTeam) {
			setValue('away_team', '');
			setValue('away_team_name', '');
			setValue('away_team_short_name', '');
		}
	}, [homeTeam, awayTeam, setValue]);

	if (!teams) return null;

	const teamOptions: OptionType[] = teams.map((team) => ({
		value: team.id.toString(),
		label: team.name
	}));
	return (
		<FormField
			control={control}
			name="home_team"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Home Team</FormLabel>
					<FormControl>
						<Select<OptionType, false>
							onChange={(option) => {
								field.onChange(option?.value);
								setValue('home_team_name', '');
								setValue('home_team_short_name', '');
							}}
							value={teamOptions.find((opt) => opt.value === field.value)}
							options={teamOptions}
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

export default HomeTeam;
