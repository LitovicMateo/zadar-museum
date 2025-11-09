import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { CoachFormData } from '@/schemas/coach-schema';

const DateOfBirth: React.FC = () => {
	const { register } = useFormContext<CoachFormData>();

	return (
		<Input
			type="date"
			{...register('date_of_birth', { required: false })}
			className="text-gray-500 placeholder:text-xs"
		/>
	);
};

export default DateOfBirth;
