import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Captain: React.FC = () => {
	const { register, setValue, watch } = useFormContext<PlayerStatsFormData>();
	const player = watch('playerId');
	return (
		<label htmlFor="captain" className="flex gap-2 items-center">
			<Input
				type="checkbox"
				{...register('isCaptain')}
				placeholder="isNeutral"
				name="isNeutral"
				className="w-4 "
				onChange={() => setValue('isCaptain', !watch('isCaptain'))}
				disabled={!player}
			/>
			<span className="text-sm whitespace-nowrap text-gray-700">Captain</span>
		</label>
	);
};

export default Captain;
