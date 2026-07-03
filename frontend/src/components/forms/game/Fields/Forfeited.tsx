import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { GameFormData } from '@/schemas/GameSchema';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';

const Forfeited: React.FC = () => {
	const { register, setValue, watch } = useFormContext<GameFormData>();

	useEffect(() => {
		setValue('forfeited', false);
	}, [setValue]);

	return (
		<FormItem className="flex flex-row items-center gap-2">
			<FormControl>
				<Input
					type="checkbox"
					{...register('forfeited')}
					className="w-4 h-4 cursor-pointer"
					defaultChecked={false}
					onChange={() => setValue('forfeited', !watch('forfeited'))}
				/>
			</FormControl>
			<FormLabel className="font-normal text-sm cursor-pointer mb-0">Game is forfeited</FormLabel>
		</FormItem>
	);
};

export default Forfeited;
