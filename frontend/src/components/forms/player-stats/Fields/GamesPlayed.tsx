import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const GamesPlayed: React.FC = () => {
	const { control, watch } = useFormContext<PlayerStatsFormData>();
	const player = watch('playerId');
	return (
		<FormField
			control={control}
			name="gamesPlayed"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Games Played</FormLabel>
					<FormControl>
						<Input {...field} disabled={!player} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default GamesPlayed;
