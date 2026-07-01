import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { SingleValue } from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

type StatusOption = {
	value: PlayerStatsFormData['status'];
	label: string;
};

const statusOptions: StatusOption[] = [
	{
		value: 'starter',
		label: 'Starter'
	},
	{
		value: 'bench',
		label: 'Bench'
	},
	{
		value: 'dnp-cd',
		label: 'DNP-CD'
	},
	{
		value: 'no-data',
		label: 'No Data'
	}
];

const Status: React.FC = () => {
	const { control, watch } = useFormContext<PlayerStatsFormData>();
	const player = watch('playerId');
	return (
		<FormField
			control={control}
			name="status"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Status</FormLabel>
					<FormControl>
						<Select<StatusOption>
							isDisabled={!player}
							placeholder="Status"
							options={statusOptions}
							value={statusOptions.find((opt) => opt.value === field.value) ?? null}
							onChange={(option: SingleValue<StatusOption>) => field.onChange(option ? option.value : null)}
							styles={selectStyle()}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default Status;
