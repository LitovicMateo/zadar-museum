import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/dasboard-list/dashboard-list';
import StaffForm from '@/components/forms/staff/StaffForm';
import { APP_ROUTES } from '@/constants/routes';
import { useStaffs } from '@/hooks/queries/staff/useStaffs';
import FormPageLayout from '@/layouts/FormPageLayout';
import { StaffFormData } from '@/schemas/staff-schema';
import { createStaff } from '@/services/staff/createStaff';
import { StaffMemberDetailsResponse as StaffDetailsResponse } from '@/types/api/staff-member';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const defaultValues: StaffFormData = {
	first_name: '',
	last_name: '',
	role: 'Assistant coach'
};

const CreateStaff: React.FC = () => {
	const queryClient = useQueryClient();

	const { data: staffs, isLoading, isError, error } = useStaffs('createdAt', 'desc');

	const mutation = useMutation({
		mutationFn: createStaff,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			toast.success(`Staff ${variables.first_name} ${variables.last_name} created successfully`);
		},
		onError: (error: Error, variables) => {
			console.error('Error creating staff', error.message);
			toast.error(`Error creating staff ${variables.first_name} ${variables.last_name}: ${error.message}`);
		}
	});

	const handleSubmit = (data: StaffFormData) => {
		mutation.mutate(data);
	};

	const itemsArray = staffs?.map((staff: StaffDetailsResponse) => ({
		id: staff.id,
		item: (
			<Link to={APP_ROUTES.dashboard.staff.edit}>
				{staff.first_name} {staff.last_name}
			</Link>
		),
		createdAt: staff.createdAt
	}));

	return (
		<FormPageLayout>
			<StaffForm
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
				header="Latest Staff"
				title="Staff"
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreateStaff;
