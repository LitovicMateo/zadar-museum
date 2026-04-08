import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { CoachFormData } from '@/schemas/CoachSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const DateOfBirth: React.FC = () => {
	const { register } = useFormContext<CoachFormData>();

	return (
		<label>
			<span className={styles.label}>Date of Birth: </span>
			<Input
				type="date"
				{...register('date_of_birth', { required: false })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default DateOfBirth;
