import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { StaffFormData } from '@/schemas/staff-schema';

const FirstName: React.FC = () => {
	const { register } = useFormContext<StaffFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				First Name: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="First Name"
				{...register('first_name', { required: 'First name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default FirstName;
