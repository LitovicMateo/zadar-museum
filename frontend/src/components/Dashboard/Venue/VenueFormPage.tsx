import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import VenueForm from '@/components/forms/venue/VenueForm';
import { useVenueAdminDetails } from '@/hooks/queries/venue/UseVenueAdminDetails';
import FormPageLayout from '@/layouts/FormPageLayout';
import { createVenue } from '@/services/venue/CreateVenue';
import { updateVenue } from '@/services/venue/UpdateVenue';

const VenueFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: venue } = useVenueAdminDetails(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: any) =>
			documentId ? updateVenue({ ...data, id: documentId }) : createVenue(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['venue', 'admin-list'] });
			toast.success(mode === 'create' ? 'Venue created successfully' : 'Venue updated successfully');
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues = venue
		? {
				name: venue.name,
				city: venue.city,
				country: venue.country,
				image: venue.image || null
			}
		: undefined;

	return (
		<FormPageLayout>
			<VenueForm
				venue={venue}
				onSubmit={(data: any) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default VenueFormPage;
