import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { TeamFormData, teamSchema } from '@/schemas/team-schema';
import { TeamDetailsResponse } from '@/types/api/team';
import { zodResolver } from '@hookform/resolvers/zod';

type TeamFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: TeamFormData) => void;
	defaultValues: TeamFormData;
	team?: TeamDetailsResponse;
	isSuccess?: boolean;
};
const TeamFormProvider: React.FC<TeamFormProviderProps> = ({ children, onSubmit, defaultValues, team, isSuccess }) => {
	const methods = useForm<TeamFormData>({
		resolver: zodResolver(teamSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<TeamFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (team) {
			methods.reset({
				name: team.name,
				alternate_names: team.alternate_names,
				short_name: team.short_name,
				city: team.city,
				country: team.country,
				image: team.image
			});
		}
	}, [team, methods]);

	React.useEffect(() => {
		if (isSuccess) {
			methods.reset(defaultValues);
			methods.setFocus('name');
		}
	}, [isSuccess, methods, defaultValues]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default TeamFormProvider;
