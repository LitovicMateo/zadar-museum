import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

const Defense: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<div className="grid grid-cols-3 gap-2">
			<Input {...register('steals')} disabled={!game} placeholder="Steals" />
			<Input {...register('blocks')} disabled={!game} placeholder="Blocks" />
			<Input {...register('fouls')} disabled={!game} placeholder="Fouls" />
		</div>
	);
};

export default Defense;
