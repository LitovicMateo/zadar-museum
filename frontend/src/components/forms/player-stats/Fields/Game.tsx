import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { useCompetitionGames } from '@/hooks/queries/dasboard/useCompetitionGames';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Game: React.FC = () => {
	const { control, setValue, watch } = useFormContext<PlayerStatsFormData>();

	const season = watch('season');
	const league = watch('league');

	const { data: games } = useCompetitionGames(season, league?.toString() || '');

	const gameOptions = games?.map((g) => ({
		value: g.id.toString(),
		label: `R${g.round}: ${g.home_team_name} vs ${g.away_team_name}`
	}));

	return (
		<Controller
			control={control}
			name="gameId"
			render={({ field }) => (
				<Select
					value={gameOptions?.find((option) => option.value === field.value) || null}
					onChange={(option) => {
						field.onChange(option?.value || '');
						setValue('teamId', '');
					}}
					placeholder="Select Game"
					options={gameOptions}
					isClearable
					isDisabled={!league}
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default Game;
