import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { usePlayers } from '@/hooks/queries/player/UsePlayers';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { PlayerResponse } from '@/types/api/Player';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Player: React.FC = () => {
	const { control, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');

	// detect edit mode from the URL path (e.g. '/player-stats/edit')
	const isEdit = typeof window !== 'undefined' && window.location.pathname.includes('/player-stats/edit');
	const { data: players } = usePlayers('last_name', 'asc');

	if (!players) return null;

	const options: OptionType[] = players?.map((player: PlayerResponse) => ({
		value: player.id.toString(),
		label: player.last_name + ' ' + player.first_name
	}));

	return (
		<FormField
			control={control}
			name="playerId"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Player</FormLabel>
					<FormControl>
						<AppSelect
							{...field}
							value={options?.find((opt) => opt.value === field.value) ?? null}
							isDisabled={!team || isEdit}
							placeholder="Select Player"
							options={options}
							onChange={(option) => field.onChange(option?.value)}
							styles={selectStyle()}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default Player;
