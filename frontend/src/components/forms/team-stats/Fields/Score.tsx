import React from 'react';
import { useFormContext } from 'react-hook-form';

import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { PeriodFormat } from '@/types/api/Game';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

type ScoreProps = {
	/** Format of the game these stats belong to; decides which fields are shown. */
	periodFormat: PeriodFormat;
};

const Score: React.FC<ScoreProps> = ({ periodFormat }) => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');

	if (periodFormat === 'halves') {
		return (
			<FormGrid cols={3}>
				<StatField label="1H" {...register('firstHalf')} disabled={!game} />
				<StatField label="2H" {...register('secondHalf')} disabled={!game} />
				<StatField label="OT" {...register('overtime')} disabled={!game} />
			</FormGrid>
		);
	}

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
