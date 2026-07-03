import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { useSeasons } from '@/hooks/queries/dasboard/UseSeasons';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Season: React.FC = () => {
	const { control, setValue } = useFormContext<TeamStatsFormData>();

	const { data: seasons } = useSeasons();

	if (!seasons) return null;

	const seasonsOptions = seasons.map((s) => ({ value: s, label: s }));

	return (
		<FormField
			control={control}
			name="season"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Season</FormLabel>
					<FormControl>
						<AppSelect
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
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default Season;
