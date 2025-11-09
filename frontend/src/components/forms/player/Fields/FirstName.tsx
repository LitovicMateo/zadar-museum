import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerFormData } from '@/schemas/player-schema';

const FirstName: React.FC = () => {
	const { register } = useFormContext<PlayerFormData>();
	return (
		<Input
			type="text"
			placeholder="First Name"
			{...register('first_name', { required: 'First name is required' })}
		/>
	);
};

export default FirstName;
