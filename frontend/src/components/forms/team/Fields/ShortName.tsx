import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamFormData } from '@/schemas/team-schema';

const ShortName: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Short Name: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="Short name (e.g. ZAD)"
				className="text-gray-500 placeholder:text-xs"
				maxLength={3}
				{...register('short_name', { required: 'Short name is required' })}
			/>
		</label>
	);
};

export default ShortName;
