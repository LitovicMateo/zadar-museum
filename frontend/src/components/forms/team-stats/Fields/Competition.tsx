import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useSeasonCompetitions } from '@/hooks/queries/dasboard/UseSeasonCompetitions';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Competition: React.FC = () => {
	const { watch, control, setValue } = useFormContext<TeamStatsFormData>();

	const season = watch('season');

	const { data: competitions } = useSeasonCompetitions(season);

	const competitionsOptions: OptionType[] =
		competitions?.map((c) => ({
			value: c.league_id,
			label: c.league_name
		})) || [];

	return (
		<FormField
			control={control}
			name="league"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Competition</FormLabel>
					<FormControl>
						<Select
							value={competitionsOptions.find((option) => option.value === field.value) || null}
							onChange={(option) => {
								field.onChange(option?.value || '');
								setValue('gameId', '');
								setValue('teamId', '');
							}}
							placeholder="Select Competition"
							options={competitionsOptions}
							isClearable
							isDisabled={!season}
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
