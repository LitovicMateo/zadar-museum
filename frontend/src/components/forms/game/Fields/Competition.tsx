import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { GameFormData } from '@/schemas/game-schema';

interface OptionType {
	value: string;
	label: string;
}

const Competition: React.FC = () => {
	const { control, setValue } = useFormContext<GameFormData>();
	const { data: competitions } = useCompetitions('slug', 'asc');

	if (!competitions) return null;

	const competitionOptions: OptionType[] = competitions.map((c) => ({
		value: c.id.toString(),
		label: c.name
	}));
	return (
		<Controller
			control={control}
			name="competition"
			render={({ field }) => (
				<Select<OptionType, false>
					className="rounded-md text-gray-500 placeholder:text-xs text-xs"
					placeholder="Select competition"
					options={competitionOptions}
					value={competitionOptions.find((opt) => opt.value === field.value)}
					onChange={(option) => {
						field.onChange(option?.value);
						setValue('league_name', '');
						setValue('league_short_name', '');
					}}
					isClearable
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default Competition;
