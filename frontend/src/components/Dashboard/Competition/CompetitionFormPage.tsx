import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import CompetitionForm from '@/components/forms/competition/CompetitionForm';
import { useQuery } from '@/hooks/UseQueryWithToast';
import FormPageLayout from '@/layouts/FormPageLayout';
import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';
import { createCompetition } from '@/services/competitions/CreateCompetition';
import { updateCompetition } from '@/services/competitions/UpdateCompetition';
import { CompetitionDetailsResponse } from '@/types/api/Competition';

const CompetitionFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: competition } = useQuery<CompetitionDetailsResponse>({
		queryKey: ['competition-admin', documentId],
		queryFn: async () => {
			const res = await apiClient.get(`${API_ROUTES.edit.competition(documentId!)}?populate=*`);
			return res.data.data;
		},
		enabled: !!documentId,
		errorMessage: 'Failed to load competition'
	});

	const mutation = useMutation({
		mutationFn: (data: any) =>
			documentId ? updateCompetition({ ...data, id: documentId }) : createCompetition(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['competition', 'admin-list'] });
			toast.success(
				mode === 'create' ? 'Competition created successfully' : 'Competition updated successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues = competition
		? {
				name: competition.name,
				short_name: competition.short_name,
				alternate_names: competition.alternate_names,
				trophies: competition.trophies,
				image: competition.image || null
			}
		: undefined;

	return (
		<FormPageLayout>
			<CompetitionForm
				competition={competition}
				onSubmit={(data: any) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CompetitionFormPage;
