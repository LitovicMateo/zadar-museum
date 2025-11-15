import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

const Rebounds: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	const rebounds = watch('rebounds');
	const offensiveRebounds = watch('offensiveRebounds');
	const defensiveRebounds = watch('defensiveRebounds');

	// disable total rebounds if offensive or defensive rebounds are filled, but enable if rebounds is filled

	return (
		<div className="grid grid-cols-3 gap-2">
			<Input {...register('offensiveRebounds')} disabled={!game || !!rebounds} placeholder="Offensive" />
			<Input {...register('defensiveRebounds')} disabled={!game || !!rebounds} placeholder="Defensive" />
			<Input
				{...register('rebounds')}
				disabled={!rebounds && (!!offensiveRebounds || !!defensiveRebounds)}
				placeholder="Total"
			/>
		</div>
	);
};

export default Rebounds;
