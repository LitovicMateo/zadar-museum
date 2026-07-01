import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';

const ActivePlayer: React.FC = () => {
	const { register, setValue, watch } = useFormContext<PlayerFormData>();
	return (
		<FormItem className="flex flex-row items-center gap-2">
			<FormControl>
				<Input
					type="checkbox"
					{...register('active_player')}
					className="w-4 h-4 cursor-pointer"
					onChange={() => setValue('active_player', !watch('active_player'))}
				/>
			</FormControl>
			<FormLabel className="font-normal text-sm cursor-pointer mb-0">Active Player</FormLabel>
		</FormItem>
	);
};

export default ActivePlayer;
