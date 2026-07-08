import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { LeagueTableFormData, leagueTableSchema } from '@/schemas/LeagueTableSchema';
import { LeagueTableRecord } from '@/types/api/LeagueTable';
import { zodResolver } from '@hookform/resolvers/zod';

import { buildLeagueTableDefaults } from './buildLeagueTableDefaults';

type LeagueTableFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: LeagueTableFormData) => void;
	defaultValues: LeagueTableFormData;
	record?: LeagueTableRecord;
	isSuccess?: boolean;
	mode: 'create' | 'edit';
};

const LeagueTableFormProvider: React.FC<LeagueTableFormProviderProps> = ({
	children,
	onSubmit,
	defaultValues,
	record,
	isSuccess,
	mode
}) => {
	const methods = useForm<LeagueTableFormData>({
		resolver: zodResolver(leagueTableSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<LeagueTableFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const label = key.charAt(0).toUpperCase() + key.slice(1);
			const message = Array.isArray(value)
				? 'Check the standings rows.'
				: (value as { message?: string })?.message;
			if (message) toast.error(`${label}: ${message}`);
		});
	};

	React.useEffect(() => {
		if (record) {
			methods.reset(buildLeagueTableDefaults(record));
		}
	}, [record, methods]);

	// After creating a table, keep the season + competition context so the next
	// stage can be entered quickly; clear the stage and standings.
	React.useEffect(() => {
		if (isSuccess && mode === 'create') {
			const current = methods.getValues();
			methods.reset({
				season: current.season,
				competition: current.competition,
				stageNumber: '',
				stageName: '',
				standings: [
					{
						team: '',
						teamName: '',
						teamShortName: '',
						gamesPlayed: '',
						wins: '',
						draws: '',
						losses: '',
						pointsDiff: '',
						points: ''
					}
				]
			});
		}
	}, [isSuccess, mode, methods]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default LeagueTableFormProvider;
