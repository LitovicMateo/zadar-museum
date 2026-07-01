import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';

const Shooting: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<FormGrid cols={2}>
			<Input {...register('fieldGoalsMade')} disabled={!team} placeholder="FGM" />
			<Input {...register('fieldGoalsAttempted')} disabled={!team} placeholder="FGA" />
			<Input {...register('threePointersMade')} disabled={!team} placeholder="3PM" />
			<Input {...register('threePointersAttempted')} disabled={!team} placeholder="3PA" />
			<Input {...register('freeThrowsMade')} disabled={!team} placeholder="FTM" />
			<Input {...register('freeThrowsAttempted')} disabled={!team} placeholder="FTA" />
		</FormGrid>
	);
};

export default Shooting;
