import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useTeams } from '@/hooks/queries/team/useTeams';
import { GameFormData } from '@/schemas/game-schema';

interface DisplayNameOption extends OptionType {
	short_name: string;
}

const HomeTeamName: React.FC = () => {
	const { control, setValue, watch } = useFormContext<GameFormData>();
	const { data: teams } = useTeams('slug', 'asc');

	const homeTeam = +watch('home_team');

	if (!teams) return null;

	const getDisplayNameOptions = (teamId?: number): DisplayNameOption[] => {
		const team = teams.find((t) => t.id === teamId);
		if (!team) return [];

		const main = { name: team.name, short_name: team.short_name };
		const alternates = team.alternate_names ?? [];

		return [main, ...alternates].map((n) => ({
			value: n.name,
			label: `${n.name} (${n.short_name})`,
			short_name: n.short_name
		}));
	};
	return (
		<Controller
			control={control}
			name="home_team_name"
			render={({ field }) => {
				const options = getDisplayNameOptions(homeTeam);

				return (
					<Select<DisplayNameOption, false>
						className="rounded-md text-gray-500 placeholder:text-xs text-xs"
						onChange={(option) => {
							field.onChange(option?.value);
							setValue('home_team_short_name', option?.short_name ?? '');
						}}
						value={options.find((opt) => opt.value === field.value) ?? null}
						options={options}
						placeholder="Select home team display name"
						isDisabled={!homeTeam}
						styles={selectStyle()}
					/>
				);
			}}
		/>
	);
};

export default HomeTeamName;
