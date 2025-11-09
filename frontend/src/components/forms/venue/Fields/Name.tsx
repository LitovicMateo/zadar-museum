import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { VenueFormData } from '@/schemas/venue-schema';

const Name: React.FC = () => {
	const { register } = useFormContext<VenueFormData>();
	return (
		<Input
			type="text"
			placeholder="e.g. Jazine"
			{...register('name', { required: 'Venue name is required' })}
			className="placeholder:text-xs"
		/>
	);
};

export default Name;
