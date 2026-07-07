import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

/**
 * Competition selector — lists ALL competitions (a league table is entered for a
 * competition regardless of whether games exist for it). The competition's numeric
 * id is stored in `competition` and posted as the relation by the mutation.
 */
const Competition: React.FC = () => {
	const { control } = useFormContext<LeagueTableFormData>();

	const { data: competitions } = useCompetitions('name', 'asc');

	const options: OptionType[] =
		competitions?.map((c) => ({
			value: c.id.toString(),
			label: c.name
		})) || [];

	return (
		<FormField
			control={control}
			name="competition"
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

export default Competition;
