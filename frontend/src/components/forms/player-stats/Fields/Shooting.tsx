import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Shooting: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<FormGrid cols={2}>
			<StatField label="FGM" {...register('fieldGoalsMade')} disabled={!team} />
			<StatField label="FGA" {...register('fieldGoalsAttempted')} disabled={!team} />
			<StatField label="3PM" {...register('threePointersMade')} disabled={!team} />
			<StatField label="3PA" {...register('threePointersAttempted')} disabled={!team} />
			<StatField label="FTM" {...register('freeThrowsMade')} disabled={!team} />
			<StatField label="FTA" {...register('freeThrowsAttempted')} disabled={!team} />
		</FormGrid>
	);
};

export default Shooting;
