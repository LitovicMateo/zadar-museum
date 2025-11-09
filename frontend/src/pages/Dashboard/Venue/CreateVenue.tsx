import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/dasboard-list/dashboard-list';
import VenueForm from '@/components/forms/venue/VenueForm';
import { APP_ROUTES } from '@/constants/routes';
import { useVenues } from '@/hooks/queries/venue/useVenues';
import FormPageLayout from '@/layouts/FormPageLayout';
import { VenueFormData } from '@/schemas/venue-schema';
import { createVenue } from '@/services/venue/createVenue';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const defaultValues: VenueFormData = {
	name: '',
	city: '',
	country: ''
};

const CreateVenue: React.FC = () => {
	const queryClient = useQueryClient();

	const { data: venues, isLoading, isError, error } = useVenues('createdAt', 'desc');

	const mutation = useMutation({
		mutationFn: createVenue,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['venues'] });
			toast.success(`Venue ${variables.name} created successfully`);
		},
		onError: (error: Error, variables) => {
			console.error('Error creating venue', error.message);
			toast.error(`Error creating venue ${variables.name}: ${error.message}`);
		}
	});

	const handleSubmit = (data: VenueFormData) => {
		mutation.mutate(data);
	};

	const itemsArr = venues?.map((venue) => ({
		id: venue.id,
		item: <Link to={APP_ROUTES.venue(venue.slug)}>{venue.name}</Link>,
		createdAt: venue.createdAt
	}));

	return (
		<FormPageLayout>
			<VenueForm
				mode="create"
				onSubmit={handleSubmit}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<DashboardList
				errorMessage={error?.message || ''}
				isError={isError}
				isLoading={isLoading}
				items={itemsArr || []}
				header="Latest Venues"
				title="Venues"
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreateVenue;
