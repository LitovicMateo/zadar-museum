import React from 'react';
import { useFormContext } from 'react-hook-form';

import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Misc: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<FormGrid cols={2}>
			<StatField label="2nd Chance" {...register('secondChancePoints')} disabled={!game} />
			<StatField label="Fastbreak" {...register('fastBreakPoints')} disabled={!game} />
			<StatField label="Pts off TO" {...register('pointsOffTurnovers')} disabled={!game} />
			<StatField label="Bench" {...register('benchPoints')} disabled={!game} />
			<StatField label="In Paint" {...register('pointsInPaint')} disabled={!game} />
		</FormGrid>
	);
};

export default Misc;
