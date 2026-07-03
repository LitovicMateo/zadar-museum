import React from 'react';
import { useFormContext } from 'react-hook-form';

import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Shooting: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');

	return (
		<FormGrid cols={2}>
			<StatField label="FGM" {...register('fieldGoalsMade')} disabled={!game} />
			<StatField label="FGA" {...register('fieldGoalsAttempted')} disabled={!game} />
			<StatField label="3PM" {...register('threePointersMade')} disabled={!game} />
			<StatField label="3PA" {...register('threePointersAttempted')} disabled={!game} />
			<StatField label="FTM" {...register('freeThrowsMade')} disabled={!game} />
			<StatField label="FTA" {...register('freeThrowsAttempted')} disabled={!game} />
		</FormGrid>
	);
};

export default Shooting;
