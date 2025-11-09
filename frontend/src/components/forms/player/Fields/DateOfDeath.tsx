import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerFormData } from '@/schemas/player-schema';

const DateOfDeath: React.FC = () => {
	const { register } = useFormContext<PlayerFormData>();

	return (
		<label htmlFor="">
			<span className="text-sm  text-gray-700 uppercase">Date of Death (Optional): </span>
			<Input type="date" {...register('date_of_death')} className="text-gray-500 placeholder:text-xs" />
		</label>
	);
};

export default DateOfDeath;
