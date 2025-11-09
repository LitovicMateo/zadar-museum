import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamFormData } from '@/schemas/team-schema';

const City: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<Input
			type="text"
			placeholder="Team city (e.g. Zadar)"
			className="placeholder:text-xs"
			{...register('city', { required: 'City is required' })}
		/>
	);
};

export default City;
