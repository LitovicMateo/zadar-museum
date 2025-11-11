import React from 'react';
import { FieldValues, useFieldArray, useFormContext, Controller, useWatch } from 'react-hook-form';
import Select from 'react-select';

import NoContent from '@/components/no-content/no-content';
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

	// ensure staffOptions is always an array to avoid TS errors
	const staffOptions: OptionType[] = (staffs ?? []).map((s) => ({
		label: `${s.first_name} ${s.last_name} (${s.role})`,
		value: s.id.toString()
	}));

	// watch current staffers values so we can filter selected ones from other selects
	const watchedStaffers = useWatch({ control, name: 'staffers' }) as (string | undefined)[] | undefined;
	const selectedIds = Array.isArray(watchedStaffers) ? watchedStaffers.map((v) => (v ? String(v) : '')) : [];

	if (!staffs) {
		return <NoContent>Loading staff members...</NoContent>;
	}

	return (
		<div className="space-y-2">
			{fields.map((field, index) => (
				<div key={field.id} className="flex items-center gap-2">
					<Controller
						control={control}
						name={`staffers.${index}` as const}
						render={({ field: controllerField }) => {
							// keep current value available in its own select, but remove other selected staffers
							const currentValue = controllerField.value as string | undefined;

							// exclude the current index value from the set of selected ids so its option remains available
							const selectedExceptCurrent = selectedIds
								.filter((_, i) => i !== index)
								.filter(Boolean) as string[];

							const availableOptions = staffOptions.filter((opt) => {
								if (!selectedExceptCurrent.length) return true;
								// keep option if it's the currently selected value, otherwise exclude if selected elsewhere
								return (
									String(opt.value) === currentValue ||
									!selectedExceptCurrent.includes(String(opt.value))
								);
							});

							return (
								<Select
									className=" rounded-md text-gray-500 placeholder:text-xs  text-xs"
									placeholder="Select staff member"
									options={availableOptions}
									value={availableOptions.find((opt) => String(opt.value) === currentValue)}
									onChange={(opt) => controllerField.onChange(opt?.value)}
									isClearable
									styles={selectStyle()}
								/>
							);
						}}
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

			{(() => {
				// determine whether all staff are already selected -> disable add
				const uniqueSelected = new Set(selectedIds.filter(Boolean));
				const allSelected = staffOptions.length > 0 && uniqueSelected.size >= staffOptions.length;

				return (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => append('')}
						disabled={allSelected}
						className="text-xs w-full! cursor-pointer"
					>
						<Plus className="h-3 w-3 mr-1" /> Add Staff Member
					</Button>
				);
			})()}
		</div>
	);
};

export default Staffers;
