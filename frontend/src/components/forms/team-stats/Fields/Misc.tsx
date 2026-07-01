import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import FormGrid from '@/components/forms/shared/FormGrid';

const Misc: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<FormGrid cols={2}>
			<Input {...register('secondChancePoints')} disabled={!game} placeholder="2nd Chance Points" />
			<Input {...register('fastBreakPoints')} disabled={!game} placeholder="Fastbreak Points" />
			<Input {...register('pointsOffTurnovers')} disabled={!game} placeholder="Points off Turnovers" />
			<Input {...register('benchPoints')} disabled={!game} placeholder="Bench Points" />
			<Input {...register('pointsInPaint')} disabled={!game} placeholder="Points in Paint" />
		</FormGrid>
	);
};

export default Misc;
