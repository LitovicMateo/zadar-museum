import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Shooting: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<div className="grid grid-cols-2 gap-2">
			<Input {...register('fieldGoalsMade')} disabled={!team} placeholder="FGM" />
			<Input {...register('fieldGoalsAttempted')} disabled={!team} placeholder="FGA" />
			<Input {...register('threePointersMade')} disabled={!team} placeholder="3PM" />
			<Input {...register('threePointersAttempted')} disabled={!team} placeholder="3PA" />
			<Input {...register('freeThrowsMade')} disabled={!team} placeholder="FTM" />
			<Input {...register('freeThrowsAttempted')} disabled={!team} placeholder="FTA" />
		</div>
	);
};

export default Shooting;
