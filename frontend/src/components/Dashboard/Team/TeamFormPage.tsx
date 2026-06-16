import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import TeamForm from '@/components/forms/team/TeamForm';
import { useQuery } from '@/hooks/UseQueryWithToast';
import FormPageLayout from '@/layouts/FormPageLayout';
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';
import { createTeam } from '@/services/teams/CreateTeam';
import { updateTeam } from '@/services/teams/UpdateTeam';
import { TeamDetailsResponse } from '@/types/api/Team';

const TeamFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: team } = useQuery<TeamDetailsResponse>({
		queryKey: ['team-admin', documentId],
		queryFn: async () => {
			const res = await apiClient.get(`${API_ROUTES.edit.team(documentId!)}?populate=*`);
			return res.data.data;
		},
		enabled: !!documentId,
		errorMessage: 'Failed to load team'
	});

	const mutation = useMutation({
		mutationFn: (data: any) =>
			documentId ? updateTeam({ ...data, id: documentId }) : createTeam(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['team', 'admin-list'] });
			toast.success(
				mode === 'create' ? `Team ${variables.name} created successfully` : 'Team updated successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues = team
		? {
				name: team.name,
				alternate_names: team.alternate_names,
				short_name: team.short_name,
				city: team.city,
				country: team.country,
				image: team.image
			}
		: undefined;

	return (
		<FormPageLayout>
			<TeamForm
				team={team}
				onSubmit={(data: any) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default TeamFormPage;
