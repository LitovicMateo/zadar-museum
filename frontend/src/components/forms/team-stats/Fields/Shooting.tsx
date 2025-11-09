import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

const Shooting: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');

	return (
		<div className="grid grid-cols-2 gap-2">
			<Input {...register('fieldGoalsMade')} disabled={!game} placeholder="FGM" />
			<Input {...register('fieldGoalsAttempted')} disabled={!game} placeholder="FGA" />
			<Input {...register('threePointersMade')} disabled={!game} placeholder="3PM" />
			<Input {...register('threePointersAttempted')} disabled={!game} placeholder="3PA" />
			<Input {...register('freeThrowsMade')} disabled={!game} placeholder="FTM" />
			<Input {...register('freeThrowsAttempted')} disabled={!game} placeholder="FTA" />
		</div>
	);
};

export default Shooting;
