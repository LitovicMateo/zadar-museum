import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerFormData } from '@/schemas/PlayerSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const FirstName: React.FC = () => {
	const { register } = useFormContext<PlayerFormData>();
	return (
		<label>
			<span className={styles.label}>
				First Name: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="First Name"
				{...register('first_name', { required: 'First name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default FirstName;
