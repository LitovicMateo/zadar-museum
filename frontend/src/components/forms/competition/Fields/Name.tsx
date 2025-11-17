import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { CompetitionFormData } from '@/schemas/competition-schema';

const Name: React.FC = () => {
	const { register } = useFormContext<CompetitionFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Competition Name: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="Competition name (e.g. FAVBET Premijer Liga)"
				{...register('name', { required: 'Name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default Name;
