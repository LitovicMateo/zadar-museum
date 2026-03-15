import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { CompetitionFormData } from '@/schemas/CompetitionSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const ShortName: React.FC = () => {
	const { register } = useFormContext<CompetitionFormData>();
	return (
		<label>
			<span className={styles.label}>
				Short Name: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="Short name (e.g. FPL)"
				{...register('short_name', { required: 'Name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default ShortName;
