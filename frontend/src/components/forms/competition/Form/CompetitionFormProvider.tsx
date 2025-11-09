import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CompetitionFormData, competitionSchema } from '@/schemas/competition-schema';
import { CompetitionDetailsResponse } from '@/types/api/competition';
import { zodResolver } from '@hookform/resolvers/zod';

type CompetitionFormProviderProps = {
	children?: React.ReactNode;
	defaultValues: CompetitionFormData;
	onSubmit: (data: CompetitionFormData) => void;
	competition?: CompetitionDetailsResponse;
	isSuccess?: boolean;
};

const CompetitionFormProvider: React.FC<CompetitionFormProviderProps> = ({
	children,
	defaultValues,
	onSubmit,
	competition,
	isSuccess
}) => {
	const methods = useForm<CompetitionFormData>({
		resolver: zodResolver(competitionSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<CompetitionFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	const { reset } = methods;

	React.useEffect(() => {
		if (competition) {
			reset({
				name: competition.name,
				short_name: competition.short_name,
				alternate_names: competition.alternate_names,
				trophies: competition.trophies
			});
		}
	}, [competition, reset]);

	React.useEffect(() => {
		if (isSuccess) {
			reset(defaultValues);
			methods.setFocus('name');
		}
	}, [isSuccess, defaultValues, reset]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default CompetitionFormProvider;
