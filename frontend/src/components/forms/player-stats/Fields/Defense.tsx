import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Defense: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<div className="grid grid-cols-2 gap-2">
			<Input disabled={!team} {...register('steals')} placeholder="Steals" />
			<Input disabled={!team} {...register('blocks')} placeholder="Blocks" />
			<Input disabled={!team} {...register('fouls')} placeholder="Fouls" />
			<Input disabled={!team} {...register('foulsOn')} placeholder="Fouls On" />
		</div>
	);
};

export default Defense;
