import React from 'react';
import { FieldValues, useFieldArray, useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';

import Button from '@/components/ui/button';
import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useStaffs } from '@/hooks/queries/staff/useStaffs';
import { GameFormData } from '@/schemas/game-schema';
import { Plus, X } from 'lucide-react';

const Staffers: React.FC = () => {
	const { control } = useFormContext<GameFormData>();

	const { fields, append, remove } = useFieldArray<GameFormData & FieldValues, 'staffers', 'id'>({
		control,
		name: 'staffers'
	});

	const { data: staffs } = useStaffs('last_name', 'asc');

	if (!staffs) return null;

	const staffOptions: OptionType[] = staffs.map((s) => ({
		label: `${s.first_name} ${s.last_name} (${s.role})`,
		value: s.id.toString()
	}));

	return (
		<div className="space-y-2">
			{fields.map((field, index) => (
				<div key={field.id} className="flex items-center gap-2">
					<Controller
						control={control}
						name={`staffers.${index}` as const}
						render={({ field }) => (
							<Select
								className=" rounded-md text-gray-500 placeholder:text-xs  text-xs"
								placeholder="Select staff member"
								options={staffOptions}
								value={staffOptions.find((opt) => opt.value === field.value)}
								onChange={(opt) => field.onChange(opt?.value)}
								isClearable
								styles={selectStyle()}
							/>
						)}
					/>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => remove(index)}
						title="Remove staff"
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
				onClick={() => append('')}
				className="text-xs w-full! cursor-pointer"
			>
				<Plus className="h-3 w-3 mr-1" /> Add Staff Member
			</Button>
		</div>
	);
};

export default Staffers;
