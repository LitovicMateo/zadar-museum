import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { useSeasons } from '@/hooks/queries/dasboard/useSeasons';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

const Season: React.FC = () => {
	const { control, setValue } = useFormContext<TeamStatsFormData>();

	const { data: seasons } = useSeasons();

	if (!seasons) return null;

	const seasonsOptions = seasons.map((s) => ({ value: s, label: s }));

	return (
		<Controller
			control={control}
			name="season"
			render={({ field }) => (
				<Select
					value={field.value ? { value: field.value, label: field.value } : null}
					onChange={(option) => {
						field.onChange(option?.value || '');
						setValue('league', '');
						setValue('gameId', '');
						setValue('teamId', '');
					}}
					placeholder="Select Season"
					options={seasonsOptions}
					isClearable
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default Season;
