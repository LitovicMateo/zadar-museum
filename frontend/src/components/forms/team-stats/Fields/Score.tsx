import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const Score: React.FC = () => {
	const { register, watch } = useFormContext<TeamStatsFormData>();

	const game = watch('gameId');

	return (
		<div className={styles.statsGrid5}>
			<Input {...register('firstQuarter')} disabled={!game} placeholder="Q1" />
			<Input {...register('secondQuarter')} disabled={!game} placeholder="Q2" />
			<Input {...register('thirdQuarter')} disabled={!game} placeholder="Q3" />
			<Input {...register('fourthQuarter')} disabled={!game} placeholder="Q4" />
			<Input {...register('overtime')} disabled={!game} placeholder="OT" />
		</div>
	);
};

export default Score;
