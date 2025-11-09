import React from 'react';
import { FieldValues, useFieldArray, useFormContext } from 'react-hook-form';

import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompetitionFormData } from '@/schemas/competition-schema';
import { Plus, X } from 'lucide-react';

const WinningSeasons: React.FC = () => {
	const { control, register } = useFormContext<CompetitionFormData>();

	const {
		fields: trophies,
		append: appendTrophy,
		remove: removeTrophy
	} = useFieldArray<
		CompetitionFormData & FieldValues, // ensures RHF recognizes it as valid form values
		'trophies', // path to your array
		'id' // key name for internal field IDs
	>({
		control,
		name: 'trophies'
	});
	return (
		<div className="space-y-2">
			{trophies.map((field, index) => (
				<div key={field.id} className="flex items-center gap-2">
					<Input
						type="text"
						placeholder="e.g. 2025"
						className="placeholder:text-xs"
						{...register(`trophies.${index}` as const, {
							required: 'Alternate name is required'
						})}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => removeTrophy(index)}
						title="Remove alternate name"
						className="cursor-pointer"
					>
						<X className="h-4 w-4 cursor-pointer" />
					</Button>
				</div>
			))}

			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => appendTrophy('')}
				className="text-xs !w-full cursor-pointer"
			>
				<Plus className="h-3 w-3 mr-1" /> Add Winning Season
			</Button>
		</div>
	);
};

export default WinningSeasons;
