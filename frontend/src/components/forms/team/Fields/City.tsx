import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamFormData } from '@/schemas/team-schema';

const City: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				City: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="Team city (e.g. Zadar)"
				className="text-gray-500 placeholder:text-xs"
				{...register('city', { required: 'City is required' })}
			/>
		</label>
	);
};

export default City;
