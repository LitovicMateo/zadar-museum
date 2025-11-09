import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { Input } from '@/components/ui/input';
import { selectStyle, OptionType } from '@/constants/react-select-style';
import { GameFormData } from '@/schemas/game-schema';

const playoffRounds: OptionType[] = [
	{ label: 'Round of 64', value: 'R64' },
	{ label: 'Round of 32', value: 'R32' },
	{ label: 'Round of 16', value: 'R16' },
	{ label: 'Quarter-finals', value: 'QF' },
	{ label: 'Semi-finals', value: 'SF' },
	{ label: 'Third place', value: '3RD' },
	{ label: 'Final', value: 'F' }
];

const Round: React.FC = () => {
	const { register, watch, control } = useFormContext<GameFormData>();

	const stage = watch('stage');

	if (!stage) return null;

	if (stage === 'league') {
		return (
			<Input
				className="text-gray-700 placeholder:text-xs placeholder:text-gray-400"
				type="text"
				{...register('round', { required: 'Round is required' })}
				placeholder="Round (e.g. 1, 2, etc.)"
			/>
		);
	}

	if (stage === 'playoff') {
		return (
			<Controller
				control={control}
				name={'round'}
				render={({ field }) => (
					<Select<OptionType, false>
						className="rounded-md text-xs text-gray-500"
						placeholder={'Select round'}
						options={playoffRounds}
						value={playoffRounds.find((opt) => opt.value === field.value)}
						onChange={(opt) => field.onChange(opt?.value)}
						isClearable
						styles={selectStyle()}
					/>
				)}
			/>
		);
	}

	// default to 'group'
	return (
		<Input
			className="text-gray-700 placeholder:text-xs placeholder:text-gray-400"
			type="text"
			{...register('round', { required: 'Round is required' })}
			placeholder="Round (e.g. A, B, C, etc.)"
		/>
	);
};

export default Round;
