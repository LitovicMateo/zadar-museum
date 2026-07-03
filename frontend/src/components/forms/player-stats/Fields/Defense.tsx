import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Defense: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<FormGrid cols={2}>
			<StatField label="STL" disabled={!team} {...register('steals')} />
			<StatField label="BLK" disabled={!team} {...register('blocks')} />
			<StatField label="Fouls" disabled={!team} {...register('fouls')} />
			<StatField label="Fouls On" disabled={!team} {...register('foulsOn')} />
		</FormGrid>
	);
};

export default Defense;
