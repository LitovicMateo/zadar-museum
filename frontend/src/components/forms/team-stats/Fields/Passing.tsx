import React from 'react';
import { useFormContext } from 'react-hook-form';

import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';
import StatField from '@/components/forms/shared/StatField';

const Passing: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<FormGrid cols={2}>
			<StatField label="AST" {...register('assists')} disabled={!game} />
			<StatField label="TO" {...register('turnovers')} disabled={!game} />
		</FormGrid>
	);
};

export default Passing;
