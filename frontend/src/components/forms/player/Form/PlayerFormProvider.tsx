import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { PlayerFormData, playerSchema } from '@/schemas/player-schema';
import { PlayerResponse } from '@/types/api/player';
import { zodResolver } from '@hookform/resolvers/zod';

type PlayerFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: PlayerFormData) => void;
	defaultValues: PlayerFormData;
	player?: PlayerResponse;
	isSuccess?: boolean;
};

const PlayerFormProvider: React.FC<PlayerFormProviderProps> = ({
	children,
	onSubmit,
	defaultValues,
	player,
	isSuccess
}) => {
	const methods = useForm<PlayerFormData>({
		resolver: zodResolver(playerSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<PlayerFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (player) {
			methods.reset({
				first_name: player.first_name,
				last_name: player.last_name,
				date_of_birth: player.date_of_birth || undefined,
				date_of_death: player.date_of_death || undefined,
				active_player: player.isActivePlayer,
				image: player.image || null,
				nationality: player.nationality,
				primary_position: player.primary_position,
				secondary_position: player.secondary_position
			});
		}
	}, [player, methods]);

	React.useEffect(() => {
		if (isSuccess) {
			methods.setFocus('first_name');
			methods.reset(defaultValues);
		}
	}, [isSuccess, methods, defaultValues]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default PlayerFormProvider;
