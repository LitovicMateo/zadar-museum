import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { GameFormData } from '@/schemas/GameSchema';

const GroupName: React.FC = () => {
	const { register, watch } = useFormContext<GameFormData>();

	const stage = watch('stage');

	if (stage !== 'group') return null;

	return (
		<Input
			className="text-gray-700 placeholder:text-xs placeholder:text-gray-400"
			type="text"
			{...register('group_name')}
			placeholder="Group name (e.g. A, Liga za prvaka, Liga za ostanak, etc.)"
		/>
	);
};

export default GroupName;
