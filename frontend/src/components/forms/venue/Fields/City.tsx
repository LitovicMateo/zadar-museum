import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { VenueFormData } from '@/schemas/venue-schema';

const City: React.FC = () => {
	const { register } = useFormContext<VenueFormData>();
	return (
		<label>
			<span className="text-sm  text-gray-700 uppercase">
				City: <span className="text-red-500">*</span>
			</span>
			<Input
				type="text"
				placeholder="e.g. Zadar"
				{...register('city', { required: 'City name is required' })}
				className="text-gray-500 placeholder:text-xs"
			/>
		</label>
	);
};

export default City;
