import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const Passing: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<div className={styles.statsGrid2}>
			<Input {...register('assists')} disabled={!game} placeholder="Assists" />
			<Input {...register('turnovers')} disabled={!game} placeholder="Turnovers" />
		</div>
	);
};

export default Passing;
