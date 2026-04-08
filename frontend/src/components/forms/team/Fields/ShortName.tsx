import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamFormData } from '@/schemas/TeamSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const ShortName: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<label>
			<span className={styles.label}>
				Short Name: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="Short name (e.g. ZAD)"
				className="text-gray-500 placeholder:text-xs"
				maxLength={3}
				{...register('short_name', { required: 'Short name is required' })}
			/>
		</label>
	);
};

export default ShortName;
