import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

/**
 * Free season input for aggregate lines. Unlike the per-game Season field, this
 * does NOT restrict to seasons that already have games — historic tournaments
 * have no games, so the season (e.g. "1948") is typed in directly.
 */
const AggregateSeason: React.FC = () => {
	const { control } = useFormContext<PlayerStatsFormData>();

	return (
		<FormField
			control={control}
			name="season"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Season</FormLabel>
					<FormControl>
						<Input {...field} maxLength={4} placeholder="e.g. 1948" />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default AggregateSeason;
