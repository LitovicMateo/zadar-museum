import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import RefereeForm from '@/components/forms/referee/RefereeForm';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';
import FormPageLayout from '@/layouts/FormPageLayout';
import { RefereeFormData } from '@/schemas/RefereeSchema';
import { createReferee } from '@/services/referees/CreateReferee';
import { updateReferee } from '@/services/referees/UpdateReferee';

const RefereeFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: referee } = useRefereeDetails(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: RefereeFormData) =>
			documentId ? updateReferee({ ...data, id: documentId }) : createReferee(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['referee', 'admin-list'] });
			toast.success(mode === 'create' ? 'Referee created successfully' : 'Referee updated successfully');
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues = referee
		? {
				first_name: referee.first_name,
				last_name: referee.last_name,
				nationality: referee.nationality,
				image: referee.image || null
			}
		: undefined;

	return (
		<FormPageLayout>
			<RefereeForm
				referee={referee}
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default RefereeFormPage;
