import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { TeamStatsFormData, teamStatsSchema } from '@/schemas/TeamStatsSchema';
import { TeamStatsResponse } from '@/types/api/TeamStats';
import { zodResolver } from '@hookform/resolvers/zod';

import { buildTeamStatsDefaults } from './buildTeamStatsDefaults';

type TeamStatsFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: TeamStatsFormData) => void;
	defaultValues: TeamStatsFormData;
	teamStats?: TeamStatsResponse;
	isSuccess?: boolean;
};

const TeamStatsFormProvider: React.FC<TeamStatsFormProviderProps> = ({
	children,
	onSubmit,
	defaultValues,
	teamStats,
	isSuccess
}) => {
	const methods = useForm<TeamStatsFormData>({
		resolver: zodResolver(teamStatsSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<TeamStatsFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (teamStats) {
			methods.reset(buildTeamStatsDefaults(teamStats));
		}
	}, [teamStats, methods]);

	React.useEffect(() => {
		if (isSuccess) {
			const currentValues = methods.getValues();
			methods.reset({
				...defaultValues,
				season: currentValues.season,
				league: currentValues.league,
				gameId: currentValues.gameId
			});
		}
	}, [isSuccess, methods, defaultValues]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default TeamStatsFormProvider;
