import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';

const Shooting: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');

	return (
		<FormGrid cols={2}>
			<Input {...register('fieldGoalsMade')} disabled={!game} placeholder="FGM" />
			<Input {...register('fieldGoalsAttempted')} disabled={!game} placeholder="FGA" />
			<Input {...register('threePointersMade')} disabled={!game} placeholder="3PM" />
			<Input {...register('threePointersAttempted')} disabled={!game} placeholder="3PA" />
			<Input {...register('freeThrowsMade')} disabled={!game} placeholder="FTM" />
			<Input {...register('freeThrowsAttempted')} disabled={!game} placeholder="FTA" />
		</FormGrid>
	);
};

export default Shooting;
