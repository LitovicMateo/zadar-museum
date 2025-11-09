import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { GameFormData } from '@/schemas/game-schema';

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
