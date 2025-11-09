import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';

const Passing: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<div className="grid grid-cols-2 gap-2">
			<Input {...register('assists')} disabled={!game} placeholder="Assists" />
			<Input {...register('turnovers')} disabled={!game} placeholder="Turnovers" />
		</div>
	);
};

export default Passing;
