import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { GameFormData } from '@/schemas/game-schema';

const Nulled: React.FC = () => {
	const { register, setValue, watch } = useFormContext<GameFormData>();
	return (
		<label htmlFor="isNulled" className="w-full flex items-center gap-2">
			<Input
				type="checkbox"
				{...register('isNulled')}
				placeholder="isNulled"
				name="isNulled"
				className="w-[16px] "
				onChange={() => setValue('isNulled', !watch('isNulled'))}
			/>
			<span className="text-xs whitespace-nowrap">Game is nulled</span>
		</label>
	);
};

export default Nulled;
