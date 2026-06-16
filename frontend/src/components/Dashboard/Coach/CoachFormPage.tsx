import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import CoachForm from '@/components/forms/coach/CoachForm';
import { useCoachDetails } from '@/hooks/queries/coach/UseCoachDetails';
import FormPageLayout from '@/layouts/FormPageLayout';
import { CoachFormData } from '@/schemas/CoachSchema';
import { createCoach } from '@/services/coaches/CreateCoach';
import { updateCoach } from '@/services/coaches/UpdateCoach';

const CoachFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: coach } = useCoachDetails(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: CoachFormData) =>
			documentId ? updateCoach({ ...data, id: documentId }) : createCoach(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['coach', 'admin-list'] });
			toast.success(mode === 'create' ? 'Coach created successfully' : 'Coach updated successfully');
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues = coach
		? {
				first_name: coach.first_name,
				last_name: coach.last_name,
				date_of_birth: coach.date_of_birth || null,
				image: coach.image || null,
				nationality: coach.nationality
			}
		: undefined;

	return (
		<FormPageLayout>
			<CoachForm
				coach={coach}
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CoachFormPage;
