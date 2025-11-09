import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/dasboard-list/dashboard-list';
import CoachForm from '@/components/forms/coach/CoachForm';
import { APP_ROUTES } from '@/constants/routes';
import { useCoaches } from '@/hooks/queries/coach/useCoaches';
import FormPageLayout from '@/layouts/FormPageLayout';
import { CoachFormData } from '@/schemas/coach-schema';
import { createCoach } from '@/services/coaches/createCoach';
import { CoachDetailsResponse } from '@/types/api/coach';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const defaultValues: CoachFormData = {
	first_name: '',
	last_name: '',
	date_of_birth: null,
	nationality: '',
	image: null
};

const CreateCoach: React.FC = () => {
	const queryClient = useQueryClient();

	const { data: coaches, isLoading, isError, error } = useCoaches('createdAt', 'desc');

	const mutation = useMutation({
		mutationFn: createCoach,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['coaches'] });
			toast.success(`Coach ${variables.first_name} ${variables.last_name} created successfully`);
		},
		onError: (error: Error, variables) => {
			console.error('Error creating coach', error.message);
			toast.error(`Error creating coach ${variables.first_name} ${variables.last_name}: ${error.message}`);
		}
	});

	const handleSubmit = (data: CoachFormData) => {
		mutation.mutate(data);
	};

	const itemsArray = coaches?.map((coach: CoachDetailsResponse) => ({
		id: coach.id,
		item: (
			<Link to={APP_ROUTES.coach(coach.documentId)}>
				{coach.first_name} {coach.last_name}
			</Link>
		),
		createdAt: coach.createdAt
	}));

	return (
		<FormPageLayout>
			<CoachForm
				onSubmit={handleSubmit}
				mode="create"
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<DashboardList
				errorMessage={error?.message || ''}
				isError={isError}
				isLoading={isLoading}
				items={itemsArray || []}
				header="Latest Coaches"
				title="Coaches"
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreateCoach;
