import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { SingleValue } from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { PlayerStatsFormData } from '@/schemas/player-stats';

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
		<Controller
			name="status"
			control={control}
			render={({ field }) => (
				<Select<StatusOption> // ✅ Tell react-select what the option type is
					isDisabled={!player}
					placeholder="Status"
					options={statusOptions}
					value={statusOptions.find((opt) => opt.value === field.value) ?? null}
					onChange={(option: SingleValue<StatusOption>) => field.onChange(option ? option.value : null)}
					styles={selectStyle()}
				/>
			)}
		/>
	);
};

export default Status;
