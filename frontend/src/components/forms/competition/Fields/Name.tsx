import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { CompetitionFormData } from '@/schemas/CompetitionSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const Name: React.FC = () => {
	const { register } = useFormContext<CompetitionFormData>();
	return (
		<label>
			<span className={styles.label}>
				Competition Name: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="Competition name (e.g. FAVBET Premijer Liga)"
				{...register('name', { required: 'Name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default Name;
