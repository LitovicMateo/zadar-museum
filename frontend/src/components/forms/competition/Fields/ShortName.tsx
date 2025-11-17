import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { CompetitionFormData } from '@/schemas/competition-schema';

const ShortName: React.FC = () => {
	const { register } = useFormContext<CompetitionFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Short Name: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="Short name (e.g. FPL)"
				{...register('short_name', { required: 'Name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default ShortName;
