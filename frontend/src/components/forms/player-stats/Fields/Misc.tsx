import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Misc: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<FormGrid cols={3}>
			<StatField label="BLK Rcv" {...register('blocksReceived')} disabled={!team} />
			<StatField label="+/−" {...register('plusMinus')} disabled={!team} />
			<StatField label="EFF" {...register('efficiency')} disabled={!team} />
		</FormGrid>
	);
};

export default Misc;
