import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

/**
 * Competition selector for aggregate lines — lists ALL competitions (not just the
 * ones with games in a given season), because a historic tournament being entered
 * has no games yet. The selected competition's numeric id is stored in `league`
 * and posted as the `competition` relation by the aggregate mutation.
 */
const AggregateCompetition: React.FC = () => {
	const { control } = useFormContext<PlayerStatsFormData>();

	const { data: competitions } = useCompetitions('name', 'asc');

	const options: OptionType[] =
		competitions?.map((c) => ({
			value: c.id.toString(),
			label: c.name
		})) || [];

	return (
		<FormField
			control={control}
			name="league"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Competition</FormLabel>
					<FormControl>
						<AppSelect
							value={options.find((option) => option.value === field.value) || null}
							onChange={(option) => field.onChange(option?.value || '')}
							placeholder="Select Competition"
							options={options}
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

export default AggregateCompetition;
