import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';

const Passing: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<FormGrid cols={2}>
			<Input disabled={!team} {...register('assists')} placeholder="Assists" />
			<Input disabled={!team} {...register('turnovers')} placeholder="Turnovers" />
		</FormGrid>
	);
};

export default Passing;
