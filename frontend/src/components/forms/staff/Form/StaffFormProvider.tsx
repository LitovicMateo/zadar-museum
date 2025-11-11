import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { StaffFormData, staffSchema } from '@/schemas/staff-schema';
import { StaffDetailsResponse } from '@/types/api/staff';
import { zodResolver } from '@hookform/resolvers/zod';

type StaffFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: StaffFormData) => void;
	defaultValues: StaffFormData;
	staff?: StaffDetailsResponse;
	isSuccess?: boolean;
};

const StaffFormProvider: React.FC<StaffFormProviderProps> = ({
	defaultValues,
	onSubmit,
	children,
	staff,
	isSuccess
}) => {
	const methods = useForm<StaffFormData>({
		resolver: zodResolver(staffSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<StaffFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (staff) {
			methods.reset({
				first_name: staff.first_name,
				last_name: staff.last_name,
				role: staff.role as StaffFormData['role']
			});
		}
	}, [staff, methods]);

	React.useEffect(() => {
		if (isSuccess) {
			methods.reset(defaultValues);
			methods.setFocus('first_name');
		}
	}, [isSuccess, methods, defaultValues]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default StaffFormProvider;
