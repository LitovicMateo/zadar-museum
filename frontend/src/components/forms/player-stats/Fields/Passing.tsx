import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import styles from '@/components/forms/shared/FormLabel.module.css';

const Passing: React.FC = () => {
	const { register, watch } = useFormContext<PlayerStatsFormData>();

	const team = watch('teamId');
	return (
		<div className={styles.statsGrid2}>
			<Input disabled={!team} {...register('assists')} placeholder="Assists" />
			<Input disabled={!team} {...register('turnovers')} placeholder="Turnovers" />
		</div>
	);
};

export default Passing;
