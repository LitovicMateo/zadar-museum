import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useVenues } from '@/hooks/queries/venue/UseVenues';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Venue: React.FC = () => {
	const { control } = useFormContext<GameFormData>();
	const { data: venues } = useVenues('slug', 'asc');

	if (!venues) return null;

	const venueOptions: OptionType[] = venues.map((v) => ({
		value: v.id.toString(),
		label: v.name
	}));

	return (
		<FormField
			control={control}
			name="venue"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Venue</FormLabel>
					<FormControl>
						<AppSelect<OptionType, false>
							placeholder="Select venue"
							options={venueOptions}
							value={venueOptions.find((opt) => opt.value === field.value)}
							onChange={(opt) => field.onChange(opt?.value)}
							isClearable
							styles={selectStyle()}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default Venue;
