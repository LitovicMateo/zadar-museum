import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamFormData } from '@/schemas/team-schema';

const Name: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<Input
			type="text"
			placeholder="Team name (e.g. KK Zadar)"
			className="placeholder:text-xs"
			{...register('name', { required: 'Team name is required' })}
		/>
	);
};

export default Name;
