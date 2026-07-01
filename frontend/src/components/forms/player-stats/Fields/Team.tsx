import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { useGameTeams } from '@/hooks/queries/game/UseGameTeams';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Team: React.FC = () => {
	const { control, watch } = useFormContext<PlayerStatsFormData>();

	const game = watch('gameId');

	const { data: teams } = useGameTeams(game?.toString() || '');

	const teamOptions = teams?.teams?.map((team) => ({
		value: team.id.toString(),
		label: team.name
	}));

	return (
		<FormField
			control={control}
			name="teamId"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Team</FormLabel>
					<FormControl>
						<Select
							value={teamOptions?.find((option) => option.value === field.value) || null}
							onChange={(e) => field.onChange(e ? e.value : '')}
							placeholder="Select Team"
							options={teamOptions}
							isClearable
							isDisabled={!game}
							styles={selectStyle()}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default Team;
