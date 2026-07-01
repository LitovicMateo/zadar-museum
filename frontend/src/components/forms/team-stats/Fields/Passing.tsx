import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';

const Passing: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<FormGrid cols={2}>
			<Input {...register('assists')} disabled={!game} placeholder="Assists" />
			<Input {...register('turnovers')} disabled={!game} placeholder="Turnovers" />
		</FormGrid>
	);
};

export default Passing;
