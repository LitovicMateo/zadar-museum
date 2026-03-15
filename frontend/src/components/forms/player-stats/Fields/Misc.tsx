import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import styles from '@/components/forms/shared/FormLabel.module.css';

const Misc: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<div className={styles.statsGrid}>
			<Input {...register('blocksReceived')} disabled={!team} placeholder="Blocks Received" />
			<Input {...register('plusMinus')} disabled={!team} placeholder="Plus-Minus" />
			<Input {...register('efficiency')} disabled={!team} placeholder="Efficiency" />
		</div>
	);
};

export default Misc;
