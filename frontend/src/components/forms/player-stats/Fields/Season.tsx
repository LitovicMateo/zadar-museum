import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { useSeasons } from '@/hooks/queries/dasboard/UseSeasons';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';

const Season: React.FC = () => {
	const { control, setValue } = useFormContext<PlayerStatsFormData>();

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
