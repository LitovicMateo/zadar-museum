import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { RefereeFormData, refereeSchema } from '@/schemas/referee-schema';
import { RefereeDetailsResponse } from '@/types/api/referee';
import { zodResolver } from '@hookform/resolvers/zod';

type RefereeFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: RefereeFormData) => void;
	defaultValues: RefereeFormData;
	referee?: RefereeDetailsResponse;
	isSuccess?: boolean;
};

const RefereeFormProvider: React.FC<RefereeFormProviderProps> = ({
	defaultValues,
	onSubmit,
	children,
	referee,
	isSuccess
}) => {
	const methods = useForm<RefereeFormData>({
		resolver: zodResolver(refereeSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<RefereeFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (referee) {
			methods.reset({
				first_name: referee.first_name,
				last_name: referee.last_name,
				nationality: referee.nationality
			});
		}
	}, [referee, methods]);

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

export default RefereeFormProvider;
