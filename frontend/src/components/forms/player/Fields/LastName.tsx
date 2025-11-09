import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerFormData } from '@/schemas/player-schema';

const LastName: React.FC = () => {
	const { register } = useFormContext<PlayerFormData>();
	return (
		<Input type="text" placeholder="Last Name" {...register('last_name', { required: 'Last name is required' })} />
	);
};

export default LastName;
