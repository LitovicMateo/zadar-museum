import React from 'react';
import { FieldValues, useFieldArray, useFormContext } from 'react-hook-form';

import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompetitionFormData } from '@/schemas/competition-schema';
import { Plus, X } from 'lucide-react';

const AlternateNames: React.FC = () => {
	const { control, register } = useFormContext<CompetitionFormData>();

	const { fields, append, remove } = useFieldArray<
		CompetitionFormData & FieldValues, // ensures RHF recognizes it as valid form values
		'alternate_names', // path to your array
		'id' // key name for internal field IDs
	>({
		control,
		name: 'alternate_names'
	});

	return (
		<div className="space-y-2">
			{fields.map((field, index) => (
				<div key={field.id} className="flex items-center gap-2">
					<Input
						type="text"
						placeholder="e.g. SuperSport Premijer Liga"
						className="placeholder:text-xs"
						{...register(`alternate_names.${index}.name` as const, {
							required: 'Alternate name is required'
						})}
					/>
					<Input
						type="text"
						placeholder="e.g. SPL"
						maxLength={3}
						className="placeholder:text-xs "
						{...register(`alternate_names.${index}.short_name` as const, {
							required: 'Short name is required'
						})}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => remove(index)}
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
				onClick={() => append({ name: '', short_name: '' })}
				className="text-xs !w-full cursor-pointer"
			>
				<Plus className="h-3 w-3 mr-1" /> Add Alternate Name
			</Button>
		</div>
	);
};

export default AlternateNames;
