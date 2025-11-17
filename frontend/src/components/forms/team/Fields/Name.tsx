import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamFormData } from '@/schemas/team-schema';

const Name: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Team Name: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="Team name (e.g. KK Zadar)"
				className="text-gray-500 placeholder:text-xs"
				{...register('name', { required: 'Team name is required' })}
			/>
		</label>
	);
};

export default Name;
