import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { VenueFormData } from '@/schemas/VenueSchema';
import styles from '@/components/forms/shared/FormLabel.module.css';

const City: React.FC = () => {
	const { register } = useFormContext<VenueFormData>();
	return (
		<label>
			<span className={styles.label}>
				City: <span className={styles.required}>*</span>
			</span>
			<Input
				type="text"
				placeholder="e.g. Zadar"
				{...register('city', { required: 'City name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default City;
