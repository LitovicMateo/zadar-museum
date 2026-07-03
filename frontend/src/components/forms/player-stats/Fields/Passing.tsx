import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Passing: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<FormGrid cols={2}>
			<StatField label="AST" disabled={!team} {...register('assists')} />
			<StatField label="TO" disabled={!team} {...register('turnovers')} />
		</FormGrid>
	);
};

export default Passing;
