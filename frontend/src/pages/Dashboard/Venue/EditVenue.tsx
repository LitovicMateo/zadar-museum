import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import VenueForm from '@/components/forms/venue/VenueForm';
import { useVenueDetails } from '@/hooks/queries/venue/useVenueDetails';
import { useVenues } from '@/hooks/queries/venue/useVenues';
import { VenueFormData } from '@/schemas/venue-schema';
import { updateVenue } from '@/services/venue/updateVenue';
import { useMutation } from '@tanstack/react-query';

const EditVenue: React.FC = () => {
	const [venueSlug, setVenueSlug] = useState('');

	const { data: venues } = useVenues('slug', 'desc');
	const { data: venue } = useVenueDetails(venueSlug);

	const mutation = useMutation({
		mutationFn: updateVenue,
		onError(error) {
			console.error('Error updating venue', error.message);
		}
	});

	const handleSubmit = (data: VenueFormData) => {
		mutation.mutate({ ...data, id: venue!.documentId });
	};

	return (
		<div>
			<div className="max-w-[200px] w-full py-4">
				<Select
					options={venues?.map((venue) => ({
						label: venue.name,
						value: venue.slug
					}))}
					onChange={(e) => setVenueSlug(e!.value.toString())}
					isSearchable
				/>
			</div>
			{venue && (
				<VenueForm
					venue={venue}
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						name: venue.name,
						city: venue.city,
						country: venue.country
					}}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditVenue;
