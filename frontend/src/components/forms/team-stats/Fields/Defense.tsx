import React from 'react';
import { useFormContext } from 'react-hook-form';

import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Defense: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<FormGrid cols={3}>
			<StatField label="STL" {...register('steals')} disabled={!game} />
			<StatField label="BLK" {...register('blocks')} disabled={!game} />
			<StatField label="Fouls" {...register('fouls')} disabled={!game} />
		</FormGrid>
	);
};

export default Defense;
