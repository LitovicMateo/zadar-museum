import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';

const Rebounds: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	const offensiveRebounds = watch('offensiveRebounds');
	const defensiveRebounds = watch('defensiveRebounds');
	const rebounds = watch('rebounds');

	return (
		<FormGrid cols={3}>
			<Input {...register('offensiveRebounds')} disabled={!!rebounds || !team} placeholder="Offensive" />
			<Input {...register('defensiveRebounds')} disabled={!!rebounds || !team} placeholder="Defensive" />
			<Input
				{...register('rebounds')}
				disabled={!!offensiveRebounds || !!defensiveRebounds || !team}
				placeholder="Total Rebounds"
			/>
		</FormGrid>
	);
};

export default Rebounds;
