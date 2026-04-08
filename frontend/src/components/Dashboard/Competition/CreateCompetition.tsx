import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/DashboardList/DashboardList';
import CompetitionForm from '@/components/forms/competition/CompetitionForm';
import { APP_ROUTES } from '@/constants/Routes';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import FormPageLayout from '@/layouts/FormPageLayout';
import { CompetitionFormData } from '@/schemas/CompetitionSchema';
import { createCompetiton } from '@/services/competitions/CreateCompetition';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const defaultValues: CompetitionFormData = {
	name: '',
	short_name: '',
	alternate_names: [],
	trophies: [],
	image: null
};

const CreateCompetition: React.FC = () => {
	const queryClient = useQueryClient();

	const { isLoading, isError, error, data } = useCompetitions('createdAt', 'desc');

	const mutation = useMutation({
		mutationFn: createCompetiton,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['competitions', 'createdAt', 'desc'] });
			toast.success(`Competition ${variables.name} created successfully`);
		},
		onError: (error: Error, variables) => {
			console.error('Error creating competition', error.message);
			toast.error(`Error creating competition ${variables.name}: ${error.message}`);
		}
	});

	const handleSubmit = (data: CompetitionFormData) => {
		mutation.mutate(data);
	};

	const items = data?.map((item) => {
		return {
			id: item.id,
			item: <Link to={APP_ROUTES.league(item.slug)}>{item.name}</Link>,
			createdAt: item.createdAt
		};
	});

	return (
		<FormPageLayout>
			<CompetitionForm
				onSubmit={handleSubmit}
				mode="create"
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<DashboardList
				errorMessage={error?.message || ''}
				isError={isError}
				isLoading={isLoading}
				items={items || []}
				header="Competition"
				title="Competitions"
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreateCompetition;
