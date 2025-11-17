import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { VenueFormData } from '@/schemas/venue-schema';

const Name: React.FC = () => {
	const { register } = useFormContext<VenueFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				Venue Name: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="e.g. Jazine"
				{...register('name', { required: 'Venue name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default Name;
