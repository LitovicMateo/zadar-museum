import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useReferees } from '@/hooks/queries/referee/useReferees';
import { GameFormData } from '@/schemas/game-schema';

const MainReferee: React.FC = () => {
	const { control } = useFormContext<GameFormData>();

	const { data: referees } = useReferees('last_name', 'asc');

	if (!referees) return null;

	const refereeOptions: OptionType[] = referees.map((ref) => ({
		label: `${ref.first_name} ${ref.last_name}`,
		value: ref.id.toString()
	}));

	return (
		<Controller
			control={control}
			name="mainReferee"
			render={({ field }) => (
				<Select
					className=" rounded-md text-gray-500 placeholder:text-xs  text-xs"
					placeholder="Select Referee #1"
					options={refereeOptions}
					value={refereeOptions.find((opt) => opt.value === field.value)}
					onChange={(opt) => field.onChange(opt?.value)}
					isClearable
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default MainReferee;
