import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const Defense: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');
	return (
		<div className={styles.statsGrid3}>
			<Input {...register('steals')} disabled={!game} placeholder="Steals" />
			<Input {...register('blocks')} disabled={!game} placeholder="Blocks" />
			<Input {...register('fouls')} disabled={!game} placeholder="Fouls" />
		</div>
	);
};

export default Defense;
