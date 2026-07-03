import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import FormWrapper from '@/components/UI/FormWrapper';
import { PlayerStatsFormData, playerStatsSchema } from '@/schemas/PlayerStats';
import { zodResolver } from '@hookform/resolvers/zod';

import AggregatePlayerStatsFormContent from './Form/AggregatePlayerStatsFormContent';

type AggregatePlayerStatsFormProps = {
	onSubmit: (data: PlayerStatsFormData) => void;
	mode: 'create' | 'edit';
	defaultValues?: PlayerStatsFormData;
	isSuccess?: boolean;
};

const emptyDefaults: PlayerStatsFormData = {
	season: '',
	league: '',
	gameId: '',
	teamId: '',
	playerId: '',
	status: 'no-data',
	isCaptain: false,
	playerNumber: '',
	gamesPlayed: '',
	minutes: '',
	seconds: '',
	points: '',
	fieldGoalsMade: '',
	fieldGoalsAttempted: '',
	threePointersMade: '',
	threePointersAttempted: '',
	freeThrowsMade: '',
	freeThrowsAttempted: '',
	rebounds: '',
	offensiveRebounds: '',
	defensiveRebounds: '',
	assists: '',
	steals: '',
	blocks: '',
	turnovers: '',
	fouls: '',
	foulsOn: '',
	blocksReceived: '',
	plusMinus: '',
	efficiency: ''
};

const AggregatePlayerStatsForm: React.FC<AggregatePlayerStatsFormProps> = ({
	onSubmit,
	mode,
	defaultValues = emptyDefaults,
	isSuccess
}) => {
	const methods = useForm<PlayerStatsFormData>({
		resolver: zodResolver(playerStatsSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<PlayerStatsFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const label = key.charAt(0).toUpperCase() + key.slice(1);
			if (value) toast.error(`${label}: ${value.message}`);
		});
	};

	// After a successful create, keep the tournament context (season / competition /
	// team) so the next player of the same tournament can be entered immediately.
	// In edit mode we leave the populated form as-is.
	React.useEffect(() => {
		if (isSuccess && mode === 'create') {
			const current = methods.getValues();
			methods.reset({
				...emptyDefaults,
				season: current.season,
				league: current.league,
				teamId: current.teamId
			});
			methods.setFocus('playerId');
		}
	}, [isSuccess, mode, methods]);

	return (
		<FormWrapper>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>
					<AggregatePlayerStatsFormContent mode={mode} />
				</form>
			</FormProvider>
		</FormWrapper>
	);
};

export default AggregatePlayerStatsForm;
