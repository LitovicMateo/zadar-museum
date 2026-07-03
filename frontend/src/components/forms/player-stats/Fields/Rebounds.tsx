import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Rebounds: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	const offensiveRebounds = watch('offensiveRebounds');
	const defensiveRebounds = watch('defensiveRebounds');
	const rebounds = watch('rebounds');

	return (
		<FormGrid cols={3}>
			<StatField label="OFF" {...register('offensiveRebounds')} disabled={!!rebounds || !team} />
			<StatField label="DEF" {...register('defensiveRebounds')} disabled={!!rebounds || !team} />
			<StatField
				label="Total"
				{...register('rebounds')}
				disabled={!!offensiveRebounds || !!defensiveRebounds || !team}
			/>
		</FormGrid>
	);
};

export default Rebounds;
