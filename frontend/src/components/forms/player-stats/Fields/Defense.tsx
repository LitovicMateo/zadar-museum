import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import styles from '@/components/forms/shared/FormLabel.module.css';

const Defense: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<div className={styles.statsGrid2}>
			<Input disabled={!team} {...register('steals')} placeholder="Steals" />
			<Input disabled={!team} {...register('blocks')} placeholder="Blocks" />
			<Input disabled={!team} {...register('fouls')} placeholder="Fouls" />
			<Input disabled={!team} {...register('foulsOn')} placeholder="Fouls On" />
		</div>
	);
};

export default Defense;
