import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Passing: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<div className="grid grid-cols-2 gap-2">
			<Input disabled={!team} {...register('assists')} placeholder="Assists" />
			<Input disabled={!team} {...register('turnovers')} placeholder="Turnovers" />
		</div>
	);
};

export default Passing;
