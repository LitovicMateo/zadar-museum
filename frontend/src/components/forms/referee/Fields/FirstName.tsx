import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { RefereeFormData } from '@/schemas/referee-schema';

const FirstName: React.FC = () => {
	const { register } = useFormContext<RefereeFormData>();
	return (
		<Input
			type="text"
			placeholder="First Name"
			{...register('first_name', { required: 'First name is required' })}
			className="placeholder:text-xs"
		/>
	);
};

export default FirstName;
