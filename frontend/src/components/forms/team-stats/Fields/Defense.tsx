import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';

const Defense: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<FormGrid cols={3}>
			<Input {...register('steals')} disabled={!game} placeholder="Steals" />
			<Input {...register('blocks')} disabled={!game} placeholder="Blocks" />
			<Input {...register('fouls')} disabled={!game} placeholder="Fouls" />
		</FormGrid>
	);
};

export default Defense;
