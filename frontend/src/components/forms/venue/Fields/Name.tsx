import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { VenueFormData } from '@/schemas/VenueSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const Name: React.FC = () => {
	const { register } = useFormContext<VenueFormData>();
	return (
		<label>
			<span className={styles.label}>
				Venue Name: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="e.g. Jazine"
				{...register('name', { required: 'Venue name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default Name;
