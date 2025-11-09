import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { GameFormData } from '@/schemas/game-schema';

const Season: React.FC = () => {
	const { register } = useFormContext<GameFormData>();
	return (
		<Input
			className="text-gray-700 placeholder:text-xs placeholder:text-gray-400"
			type="text"
			maxLength={4}
			{...register('season', { required: 'Season is required' })}
			placeholder="Season (e.g. 2025)"
		/>
	);
};

export default Season;
