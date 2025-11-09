import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerFormData } from '@/schemas/player-schema';

const DateOfBirth: React.FC = () => {
	const { register } = useFormContext<PlayerFormData>();

	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">Date of Birth: </span>
			<Input type="date" {...register('date_of_birth')} className="text-gray-500 placeholder:text-xs" />
		</label>
	);
};

export default DateOfBirth;
