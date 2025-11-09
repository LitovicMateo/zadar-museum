import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { GameFormData } from '@/schemas/game-schema';

const Forfeited: React.FC = () => {
	const { register, setValue, watch } = useFormContext<GameFormData>();

	useEffect(() => {
		setValue('forfeited', false);
	}, []);
	return (
		<label htmlFor="forfeited" className="w-full flex items-center gap-2">
			<Input
				type="checkbox"
				{...register('forfeited')}
				placeholder="forfeited"
				name="forfeited"
				className="w-[16px] "
				defaultChecked={false}
				onChange={() => setValue('forfeited', !watch('forfeited'))}
			/>
			<span className="text-xs whitespace-nowrap">Game is forfeited</span>
		</label>
	);
};

export default Forfeited;
