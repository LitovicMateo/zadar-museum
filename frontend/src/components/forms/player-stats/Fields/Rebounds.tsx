import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Rebounds: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	const offensiveRebounds = watch('offensiveRebounds');
	const defensiveRebounds = watch('defensiveRebounds');
	const rebounds = watch('rebounds');

	return (
		<div className="grid grid-cols-3 gap-2">
			<Input {...register('offensiveRebounds')} disabled={!!rebounds || !team} placeholder="Offensive" />
			<Input {...register('defensiveRebounds')} disabled={!!rebounds || !team} placeholder="Defensive" />
			<Input
				{...register('rebounds')}
				disabled={!!offensiveRebounds || !!defensiveRebounds || !team}
				placeholder="Total Rebounds"
			/>
		</div>
	);
};

export default Rebounds;
