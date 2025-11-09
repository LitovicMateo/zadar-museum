import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerFormData } from '@/schemas/player-schema';

const ActivePlayer: React.FC = () => {
	const { register, setValue, watch } = useFormContext<PlayerFormData>();
	return (
		<label htmlFor="isNeutral" className="w-full flex items-center gap-2">
			<Input
				type="checkbox"
				{...register('active_player')}
				placeholder="isActivePlayer"
				name="isActivePlayer"
				className="w-[16px] "
				onChange={() => setValue('active_player', !watch('active_player'))}
			/>
			<span className="text-xs whitespace-nowrap">Active Player</span>
		</label>
	);
};

export default ActivePlayer;
