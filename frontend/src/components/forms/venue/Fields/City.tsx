import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { VenueFormData } from '@/schemas/venue-schema';

const City: React.FC = () => {
	const { register } = useFormContext<VenueFormData>();
	return (
		<Input
			type="text"
			placeholder="e.g. Zadar"
			{...register('city', { required: 'City name is required' })}
			className="placeholder:text-xs"
		/>
	);
};

export default City;
