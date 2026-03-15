import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';

const Number: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();
	const player = watch('playerId');
	return <Input {...register('playerNumber')} disabled={!player} placeholder="Player #" />;
};

export default Number;
