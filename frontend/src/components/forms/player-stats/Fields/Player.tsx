import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { usePlayers } from '@/hooks/queries/player/UsePlayers';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { PlayerResponse } from '@/types/api/Player';

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
		<Controller
			name="playerId"
			control={control}
			render={({ field }) => {
				return (
					<Select
						{...field}
						value={options?.find((opt) => opt.value === field.value) ?? null}
						isDisabled={!team || isEdit}
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
