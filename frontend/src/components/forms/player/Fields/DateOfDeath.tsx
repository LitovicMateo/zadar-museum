import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const DateOfDeath: React.FC = () => {
	const { register } = useFormContext<PlayerFormData>();

	return (
		<label htmlFor="">
			<span className={styles.label}>Date of Death (Optional): </span>
			<Input type="date" {...register('date_of_death')} className="text-gray-500 placeholder:text-xs" />
		</label>
	);
};

export default DateOfDeath;
