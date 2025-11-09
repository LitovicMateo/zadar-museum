import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

const Score: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');

	return (
		<div className="grid grid-cols-5 gap-2">
			<Input {...register('firstQuarter')} disabled={!game} placeholder="Q1" />
			<Input {...register('secondQuarter')} disabled={!game} placeholder="Q2" />
			<Input {...register('thirdQuarter')} disabled={!game} placeholder="Q3" />
			<Input {...register('fourthQuarter')} disabled={!game} placeholder="Q4" />
			<Input {...register('overtime')} disabled={!game} placeholder="OT" />
		</div>
	);
};

export default Score;
