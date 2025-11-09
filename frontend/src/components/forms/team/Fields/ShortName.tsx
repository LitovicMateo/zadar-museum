import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TeamFormData } from '@/schemas/team-schema';

const ShortName: React.FC = () => {
	const { register } = useFormContext<TeamFormData>();
	return (
		<Input
			type="text"
			placeholder="Short name (e.g. ZAD)"
			className="placeholder:text-xs"
			maxLength={3}
			{...register('short_name', { required: 'Short name is required' })}
		/>
	);
};

export default ShortName;
