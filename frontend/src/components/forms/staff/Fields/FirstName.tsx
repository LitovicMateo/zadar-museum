import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { StaffFormData } from '@/schemas/staff-schema';

const FirstName: React.FC = () => {
	const { register } = useFormContext<StaffFormData>();
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
