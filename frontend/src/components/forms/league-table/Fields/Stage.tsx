import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

/**
 * Stage number + name. Some competitions run multiple league stages in a season
 * (e.g. ABA League), so the stage identifies the table alongside competition + season.
 */
const Stage: React.FC = () => {
	const { control } = useFormContext<LeagueTableFormData>();

	return (
		<div className="grid grid-cols-1 gap-2 sm:grid-cols-[7rem_1fr]">
			<FormField
				control={control}
				name="stageNumber"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Stage #</FormLabel>
						<FormControl>
							<Input type="number" min={1} placeholder="1" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="stageName"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Stage name</FormLabel>
						<FormControl>
							<Input placeholder="e.g. Regular Season" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};

export default Stage;
