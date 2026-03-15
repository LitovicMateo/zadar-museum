import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { StaffFormData } from '@/schemas/StaffSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const FirstName: React.FC = () => {
	const { register } = useFormContext<StaffFormData>();
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
