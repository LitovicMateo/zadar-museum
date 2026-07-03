import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import StatField from '@/components/forms/shared/StatField';

const Seconds: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();
	const player = watch('playerId');
	return <StatField label="SEC" {...register('seconds')} disabled={!player} />;
};

export default Seconds;
