import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { StaffFormData } from '@/schemas/staff-schema';

const LastName: React.FC = () => {
	const { register } = useFormContext<StaffFormData>();
	return (
		<Input
			type="text"
			placeholder="Last Name"
			{...register('last_name', { required: 'Last name is required' })}
			className="placeholder:text-xs"
		/>
	);
};

export default LastName;
