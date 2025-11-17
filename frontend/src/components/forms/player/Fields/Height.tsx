import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { PlayerFormData } from '@/schemas/player-schema';

const Height: React.FC = () => {
	const { register } = useFormContext<PlayerFormData>();

	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">Height: </span>
			<Input
				type="text"
				placeholder="e.g. 203 cm"
				{...register('height')}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default Height;
