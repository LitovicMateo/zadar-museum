import React, { useEffect } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import toast from 'react-hot-toast';

import { coachSchema, CoachFormData } from '@/schemas/coach-schema';
import { CoachDetailsResponse } from '@/types/api/coach';
import { zodResolver } from '@hookform/resolvers/zod';

type CoachFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: CoachFormData) => void;
	defaultValues: CoachFormData;
	coach?: CoachDetailsResponse;
	isSuccess?: boolean;
};

const CoachFormProvider: React.FC<CoachFormProviderProps> = ({
	children,
	onSubmit,
	defaultValues,
	coach,
	isSuccess
}) => {
	const methods = useForm<CoachFormData>({
		resolver: zodResolver(coachSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<CoachFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	const { reset } = methods;

	useEffect(() => {
		if (coach) {
			reset({
				first_name: coach.first_name,
				last_name: coach.last_name,
				date_of_birth: coach.date_of_birth || null,
				image: coach.image || null,
				nationality: coach.nationality
			});
		}
	}, [coach, reset]);

	useEffect(() => {
		if (isSuccess) {
			reset(defaultValues);
			methods.setFocus('first_name');
		}
	}, [isSuccess, defaultValues, reset, methods]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default CoachFormProvider;
