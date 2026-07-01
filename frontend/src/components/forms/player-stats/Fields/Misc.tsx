import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';

const Misc: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<FormGrid cols={3}>
			<Input {...register('blocksReceived')} disabled={!team} placeholder="Blocks Received" />
			<Input {...register('plusMinus')} disabled={!team} placeholder="Plus-Minus" />
			<Input {...register('efficiency')} disabled={!team} placeholder="Efficiency" />
		</FormGrid>
	);
};

export default Misc;
