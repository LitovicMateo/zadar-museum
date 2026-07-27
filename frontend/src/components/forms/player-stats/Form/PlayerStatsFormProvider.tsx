import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { PlayerStatsFormData, playerStatsSchema } from '@/schemas/PlayerStats';
import { PlayerStatsResponse } from '@/types/api/PlayerStats';
import { zodResolver } from '@hookform/resolvers/zod';

import { buildPlayerStatsDefaults } from './buildPlayerStatsDefaults';

type PlayerStatsFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: PlayerStatsFormData) => void;
	defaultValues: PlayerStatsFormData;
	playerStats?: PlayerStatsResponse;
	isSuccess?: boolean;
	mode: 'create' | 'edit';
};

const PlayerStatsFormProvider: React.FC<PlayerStatsFormProviderProps> = ({
	children,
	onSubmit,
	defaultValues,
	playerStats,
	isSuccess,
	mode
}) => {
	const methods = useForm<PlayerStatsFormData>({
		resolver: zodResolver(playerStatsSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<PlayerStatsFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (playerStats) {
			methods.reset(buildPlayerStatsDefaults(playerStats));
		}
	}, [playerStats, methods]);

	React.useEffect(() => {
		// Only the create flow (rapid multi-player entry for one game) clears the
		// form after a save; editing an existing row should keep showing what was
		// just submitted, not snap back to the stale pre-edit defaultValues.
		if (isSuccess && mode === 'create') {
			const currentValues = methods.getValues();

			methods.reset({
				// preserve these fields
				...defaultValues,
				season: currentValues.season,
				league: currentValues.league,
				gameId: currentValues.gameId,
				teamId: currentValues.teamId
			});

			methods.setFocus('playerId');
		}
	}, [isSuccess, mode, methods, defaultValues]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default PlayerStatsFormProvider;
