import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerStatsFormData } from '@/schemas/player-stats';

const Minutes: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();
	const player = watch('playerId');
	return <Input {...register('minutes')} disabled={!player} placeholder="Minutes" />;
};

export default Minutes;
