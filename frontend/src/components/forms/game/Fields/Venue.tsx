import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useVenues } from '@/hooks/queries/venue/useVenues';
import { GameFormData } from '@/schemas/game-schema';

const Venue: React.FC = () => {
	const { control } = useFormContext<GameFormData>();
	const { data: venues } = useVenues('slug', 'asc');

	if (!venues) return null;

	const venueOptions: OptionType[] = venues.map((v) => ({
		value: v.id.toString(),
		label: v.name
	}));

	return (
		<Controller
			control={control}
			name={'venue'}
			render={({ field }) => (
				<Select<OptionType, false>
					className="rounded-md text-xs text-gray-500"
					placeholder={'Select venue'}
					options={venueOptions}
					value={venueOptions.find((opt) => opt.value === field.value)}
					onChange={(opt) => field.onChange(opt?.value)}
					isClearable
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default Venue;
