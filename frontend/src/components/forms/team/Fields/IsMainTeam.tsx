import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { TeamFormData } from '@/schemas/TeamSchema';

const IsMainTeam: React.FC = () => {
	const { control } = useFormContext<TeamFormData>();

	return (
		<Controller
			name="isMainTeam"
			control={control}
			render={({ field }) => (
				<label className="flex items-center gap-2">
					<Checkbox checked={field.value} onCheckedChange={field.onChange} />
					<span className="text-sm font-medium leading-none">Main Team</span>
				</label>
			)}
		/>
	);
};

export default IsMainTeam;
