import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { GameFormData } from '@/schemas/GameSchema';

const Attendance: React.FC = () => {
	const { register } = useFormContext<GameFormData>();

	return (
		<Input
			className="text-gray-700 placeholder:text-xs placeholder:text-gray-400"
			type="text"
			{...register('attendance', { required: 'Attendance is required' })}
			placeholder="Attendance"
		/>
	);
};

export default Attendance;
