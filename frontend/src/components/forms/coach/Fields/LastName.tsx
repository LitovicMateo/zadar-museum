import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { CoachFormData } from '@/schemas/CoachSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const LastName: React.FC = () => {
	const { register } = useFormContext<CoachFormData>();
	return (
		<label>
			<span className={styles.label}>
				Last Name: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="Last Name"
				{...register('last_name', { required: 'Last name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default LastName;
