import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { GameFormData } from '@/schemas/game-schema';

const NeutralVenue: React.FC = () => {
	const { register, setValue, watch } = useFormContext<GameFormData>();
	return (
		<label htmlFor="isNeutral" className="w-full flex items-center gap-2">
			<Input
				type="checkbox"
				{...register('isNeutral')}
				placeholder="isNeutral"
				name="isNeutral"
				className="w-[16px] "
				onChange={() => setValue('isNeutral', !watch('isNeutral'))}
			/>
			<span className="text-xs whitespace-nowrap">Neutral venue?</span>
		</label>
	);
};

export default NeutralVenue;
