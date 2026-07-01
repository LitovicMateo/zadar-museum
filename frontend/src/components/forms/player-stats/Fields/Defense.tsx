import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';

const Defense: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<FormGrid cols={2}>
			<Input disabled={!team} {...register('steals')} placeholder="Steals" />
			<Input disabled={!team} {...register('blocks')} placeholder="Blocks" />
			<Input disabled={!team} {...register('fouls')} placeholder="Fouls" />
			<Input disabled={!team} {...register('foulsOn')} placeholder="Fouls On" />
		</FormGrid>
	);
};

export default Defense;
