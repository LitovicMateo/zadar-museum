import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Misc: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<div className="grid gap-2">
			<Input {...register('blocksReceived')} disabled={!team} placeholder="Blocks Received" />
			<Input {...register('plusMinus')} disabled={!team} placeholder="Plus-Minus" />
			<Input {...register('efficiency')} disabled={!team} placeholder="Efficiency" />
		</div>
	);
};

export default Misc;
