import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { GameFormData } from '@/schemas/GameSchema';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';

const NeutralVenue: React.FC = () => {
	const { register, setValue, watch } = useFormContext<GameFormData>();
	return (
		<FormItem className="flex flex-row items-center gap-2">
			<FormControl>
				<Input
					type="checkbox"
					{...register('isNeutral')}
					className="w-4 h-4 cursor-pointer"
					onChange={() => setValue('isNeutral', !watch('isNeutral'))}
				/>
			</FormControl>
			<FormLabel className="font-normal text-sm cursor-pointer mb-0">Neutral venue?</FormLabel>
		</FormItem>
	);
};

export default NeutralVenue;
