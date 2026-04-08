import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamFormData } from '@/schemas/TeamSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const City: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<label>
			<span className={styles.label}>
				City: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="Team city (e.g. Zadar)"
				className="text-gray-500 placeholder:text-xs"
				{...register('city', { required: 'City is required' })}
			/>
		</label>
	);
};

export default City;
