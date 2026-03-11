import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { GameFormData } from '@/schemas/GameSchema';

const Date: React.FC = () => {
	const { register } = useFormContext<GameFormData>();
	return (
		<Input
			className="text-gray-700 placeholder:text-xs placeholder:text-gray-400"
			type="date"
			{...register('date', { required: 'Date is required' })}
		/>
	);
};

export default Date;
