import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { useTeams } from '@/hooks/queries/team/UseTeams';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

/**
 * Free team selector for aggregate lines — lists ALL teams, since aggregate lines
 * are not tied to a game (the per-game Team field derives its options from the
 * selected game's home/away teams). The team is required so the player's stats can
 * be classified as main vs opponent by team_slug in the aggregation layer.
 */
const AggregateTeam: React.FC = () => {
	const { control, setValue } = useFormContext<PlayerStatsFormData>();

	const { data: teams } = useTeams('name', 'asc');

	const options = teams?.map((team) => ({
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
						<AppSelect
							value={options?.find((option) => option.value === field.value) || null}
							onChange={(option) => {
								field.onChange(option?.value || '');
								setValue('playerId', '');
							}}
							placeholder="Select Team"
							options={options}
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

export default AggregateTeam;
