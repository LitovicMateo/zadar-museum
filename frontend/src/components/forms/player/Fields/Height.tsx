import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerFormData } from '@/schemas/PlayerSchema';

import styles from '@/components/forms/shared/FormLabel.module.css';

const Height: React.FC = () => {
	const { register } = useFormContext<PlayerFormData>();

	return (
		<label>
			<span className={styles.label}>Height: </span>
			<Input
				type="text"
				placeholder="e.g. 203 cm"
				{...register('height')}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default Height;
