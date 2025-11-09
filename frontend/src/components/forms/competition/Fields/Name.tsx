import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { CompetitionFormData } from '@/schemas/competition-schema';

const Name: React.FC = () => {
	const { register } = useFormContext<CompetitionFormData>();
	return (
		<Input
			type="text"
			placeholder="Competition name (e.g. FAVBET Premijer Liga)"
			{...register('name', { required: 'Name is required' })}
			className="placeholder:text-xs"
		/>
	);
};

export default Name;
