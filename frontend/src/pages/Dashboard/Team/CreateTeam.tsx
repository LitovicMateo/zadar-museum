import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/dasboard-list/dashboard-list';
import TeamForm from '@/components/forms/team/TeamForm';
import { APP_ROUTES } from '@/constants/routes';
import { useTeams } from '@/hooks/queries/team/useTeams';
import FormPageLayout from '@/layouts/FormPageLayout';
import { TeamFormData } from '@/schemas/team-schema';
import { createTeam } from '@/services/teams/createTeam';
import { TeamDetailsResponse } from '@/types/api/team';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreateTeam: React.FC = () => {
	const queryClient = useQueryClient();

	const { data: teams, isLoading, isError, error } = useTeams('createdAt', 'desc');

	const mutation = useMutation({
		mutationFn: createTeam,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['teams'] });
			toast.success(`Team ${variables.name} created successfully`);
		},
		onError: (error: Error, variables) => {
			console.error('Error creating team', error.message);
			toast.error(`Error creating team ${variables.name}: ${error.message}`);
		}
	});

	const handleSubmit = (data: TeamFormData) => {
		mutation.mutate(data);
	};

	const itemsArr = teams?.map((team: TeamDetailsResponse) => ({
		id: team.id,
		item: <Link to={APP_ROUTES.team(team.slug)}>{team.name}</Link>,
		createdAt: team.createdAt
	}));

	return (
		<FormPageLayout>
			<TeamForm onSubmit={handleSubmit} mode="create" isSuccess={mutation.isSuccess} />
			<DashboardList
				errorMessage={error?.message || ''}
				isError={isError}
				isLoading={isLoading}
				items={itemsArr || []}
				header="Teams"
				title="Teams"
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreateTeam;
