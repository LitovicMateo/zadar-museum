import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Points: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();
	const player = watch('playerId');
	return <Input {...register('points')} disabled={!player} placeholder="Points" />;
};

export default Points;
