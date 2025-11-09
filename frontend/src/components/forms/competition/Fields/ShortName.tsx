import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { CompetitionFormData } from '@/schemas/competition-schema';

const ShortName: React.FC = () => {
	const { register } = useFormContext<CompetitionFormData>();
	return (
		<Input
			type="text"
			placeholder="Short name (e.g. FPL)"
			{...register('short_name', { required: 'Name is required' })}
			className="placeholder:text-xs"
		/>
	);
};

export default ShortName;
