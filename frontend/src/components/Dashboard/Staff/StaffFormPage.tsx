import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import StaffForm from '@/components/forms/staff/StaffForm';
import { useStaffDetails } from '@/hooks/queries/staff/UseStaffDetails';
import FormPageLayout from '@/layouts/FormPageLayout';
import { StaffFormData } from '@/schemas/StaffSchema';
import { createStaff } from '@/services/staff/CreateStaff';
import { updateStaff } from '@/services/staff/UpdateStaff';

const StaffFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: staff } = useStaffDetails(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: StaffFormData) =>
			documentId ? updateStaff({ ...data, id: documentId }) : createStaff(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['staff', 'admin-list'] });
			toast.success(mode === 'create' ? 'Staff created successfully' : 'Staff updated successfully');
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues = staff
		? {
				first_name: staff.first_name,
				last_name: staff.last_name,
				role: staff.role as StaffFormData['role'],
				image: staff.image || null
			}
		: undefined;

	return (
		<FormPageLayout>
			<StaffForm
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default StaffFormPage;
