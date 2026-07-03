import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import CompetitionForm from '@/components/forms/competition/CompetitionForm';
import { useCompetitionAdminDetails } from '@/hooks/queries/competition/UseCompetitionAdminDetails';
import FormPageLayout from '@/layouts/FormPageLayout';
import { createCompetiton as createCompetition } from '@/services/competitions/CreateCompetition';
import { updateCompetition } from '@/services/competitions/UpdateCompetition';

const CompetitionFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: competition } = useCompetitionAdminDetails(documentId ?? '');

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
