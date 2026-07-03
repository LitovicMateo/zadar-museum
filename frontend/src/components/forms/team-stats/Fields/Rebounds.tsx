import React from 'react';
import { useFormContext } from 'react-hook-form';

import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Rebounds: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	const rebounds = watch('rebounds');
	const offensiveRebounds = watch('offensiveRebounds');
	const defensiveRebounds = watch('defensiveRebounds');

	return (
		<FormGrid cols={3}>
			<StatField label="OFF" {...register('offensiveRebounds')} disabled={!game || !!rebounds} />
			<StatField label="DEF" {...register('defensiveRebounds')} disabled={!game || !!rebounds} />
			<StatField
				label="Total"
				{...register('rebounds')}
				disabled={!rebounds && (!!offensiveRebounds || !!defensiveRebounds)}
			/>
		</FormGrid>
	);
};

export default Rebounds;
