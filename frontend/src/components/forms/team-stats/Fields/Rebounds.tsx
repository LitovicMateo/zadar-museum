import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';

const Rebounds: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	const rebounds = watch('rebounds');
	const offensiveRebounds = watch('offensiveRebounds');
	const defensiveRebounds = watch('defensiveRebounds');

	return (
		<FormGrid cols={3}>
			<Input {...register('offensiveRebounds')} disabled={!game || !!rebounds} placeholder="Offensive" />
			<Input {...register('defensiveRebounds')} disabled={!game || !!rebounds} placeholder="Defensive" />
			<Input
				{...register('rebounds')}
				disabled={!rebounds && (!!offensiveRebounds || !!defensiveRebounds)}
				placeholder="Total"
			/>
		</FormGrid>
	);
};

export default Rebounds;
