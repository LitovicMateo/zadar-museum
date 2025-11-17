import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { RefereeFormData } from '@/schemas/referee-schema';

const LastName: React.FC = () => {
	const { register } = useFormContext<RefereeFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Last Name: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="Last Name"
				{...register('last_name', { required: 'Last name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default LastName;
