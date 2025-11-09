import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { usePlayers } from '@/hooks/queries/player/usePlayers';
import { PlayerStatsFormData } from '@/schemas/player-stats';
import { PlayerResponse } from '@/types/api/player';

const Player: React.FC = () => {
	const { control, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	const { data: players } = usePlayers('last_name', 'asc');

	if (!players) return null;

	const options: OptionType[] = players?.map((player: PlayerResponse) => ({
		value: player.id.toString(),
		label: player.last_name + ' ' + player.first_name
	}));

	return (
		<Controller
			name="playerId"
			control={control}
			render={({ field }) => {
				return (
					<Select
						{...field}
						value={options?.find((opt) => opt.value === field.value) ?? null}
						isDisabled={!team}
						placeholder="Select Player"
						options={options}
						onChange={(option) => field.onChange(option?.value)} // store only the ID in form state
						styles={selectStyle()}
					/>
				);
			}}
		/>
	);
};

export default Player;
