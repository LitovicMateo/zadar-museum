import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamFormData } from '@/schemas/TeamSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const Name: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<label>
			<span className={styles.label}>
				Team Name: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="Team name (e.g. KK Zadar)"
				className="text-gray-500 placeholder:text-xs"
				{...register('name', { required: 'Team name is required' })}
			/>
		</label>
	);
};

export default Name;
