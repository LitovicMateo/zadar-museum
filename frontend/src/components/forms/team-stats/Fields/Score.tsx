import React from 'react';
import { useFormContext } from 'react-hook-form';

import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Score: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');

	return (
		<FormGrid cols={5}>
			<StatField label="Q1" {...register('firstQuarter')} disabled={!game} />
			<StatField label="Q2" {...register('secondQuarter')} disabled={!game} />
			<StatField label="Q3" {...register('thirdQuarter')} disabled={!game} />
			<StatField label="Q4" {...register('fourthQuarter')} disabled={!game} />
			<StatField label="OT" {...register('overtime')} disabled={!game} />
		</FormGrid>
	);
};

export default Score;
