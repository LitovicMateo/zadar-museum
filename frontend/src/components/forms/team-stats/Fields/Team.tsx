import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { useGameTeams } from '@/hooks/queries/game/useGameTeams';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

const Team: React.FC = () => {
	const { control, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');

	const { data: teams } = useGameTeams(game?.toString() || '');

	const teamOptions = teams?.teams?.map((team) => ({
		value: team.id.toString(),
		label: team.name
	}));

	return (
		<Controller
			control={control}
			name="teamId"
			render={({ field }) => (
				<Select
					value={teamOptions?.find((option) => option.value === field.value) || null}
					onChange={(e) => field.onChange(e ? e.value : '')}
					placeholder="Select Team"
					options={teamOptions}
					isClearable
					isDisabled={!game}
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default Team;
