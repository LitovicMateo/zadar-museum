import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/dasboard-list/dashboard-list';
import RefereeForm from '@/components/forms/referee/RefereeForm';
import { APP_ROUTES } from '@/constants/routes';
import { useReferees } from '@/hooks/queries/referee/useReferees';
import FormPageLayout from '@/layouts/FormPageLayout';
import { RefereeFormData } from '@/schemas/referee-schema';
import { createReferee } from '@/services/referees/createReferee';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreateReferee: React.FC = () => {
	const queryClient = useQueryClient();

	const { data: referees, isLoading, isError } = useReferees('createdAt', 'desc');

	const mutation = useMutation({
		mutationFn: createReferee,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['referees'] });
			toast.success(`Referee ${variables.first_name} ${variables.last_name} created successfully`);
		},
		onError: (error: Error, variables) => {
			console.error('Error creating referee', error.message);
			toast.error(`Error creating referee ${variables.first_name} ${variables.last_name}: ${error.message}`);
		}
	});

	const handleSubmit = (data: RefereeFormData) => {
		mutation.mutate(data);
	};

	const itemsArray = referees?.map((referee) => ({
		id: referee.id,
		item: (
			<Link to={APP_ROUTES.referee(referee.documentId)}>
				{referee.first_name} {referee.last_name}
			</Link>
		),
		createdAt: referee.createdAt
	}));

	return (
		<FormPageLayout>
			<RefereeForm onSubmit={handleSubmit} mode="create" isSuccess={mutation.isSuccess} />
			<DashboardList
				title="Referees"
				header="Name"
				items={itemsArray || []}
				isLoading={isLoading}
				isError={isError}
				errorMessage="Failed to load referees."
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreateReferee;
