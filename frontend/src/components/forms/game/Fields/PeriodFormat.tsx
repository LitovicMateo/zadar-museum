import React from 'react';
import { useFormContext } from 'react-hook-form';

import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { GameFormData } from '@/schemas/GameSchema';
import { PeriodFormat as PeriodFormatValue } from '@/types/api/Game';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const formatOptions: SegmentedOption<PeriodFormatValue>[] = [
	{ value: 'quarters', label: 'Quarters' },
	{ value: 'halves', label: 'Halves' }
];

const PeriodFormat: React.FC = () => {
	const { control } = useFormContext<GameFormData>();

	return (
		<FormField
			control={control}
			name="period_format"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Period format</FormLabel>
					<FormControl>
						<SegmentedToggle
							value={field.value}
							onValueChange={field.onChange}
							options={formatOptions}
							ariaLabel="Period format"
							className="w-fit"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default PeriodFormat;
