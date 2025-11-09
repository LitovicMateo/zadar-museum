import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { PlayerStatsFormData, playerStatsSchema } from '@/schemas/player-stats';
import { PlayerStatsResponse } from '@/types/api/player-stats';
import { zodResolver } from '@hookform/resolvers/zod';

type PlayerStatsFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: PlayerStatsFormData) => void;
	defaultValues: PlayerStatsFormData;
	playerStats?: PlayerStatsResponse;
	isSuccess?: boolean;
};

const PlayerStatsFormProvider: React.FC<PlayerStatsFormProviderProps> = ({
	children,
	onSubmit,
	defaultValues,
	playerStats,
	isSuccess
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
			methods.reset({
				gameId: playerStats.game.id.toString(),
				teamId: playerStats.team.id.toString(),
				playerId: playerStats.player.id.toString(),
				status: playerStats.status,
				isCaptain: playerStats.isCaptain,
				playerNumber: playerStats.playerNumber,
				minutes: playerStats.minutes,
				seconds: playerStats.seconds,
				points: playerStats.points,
				fieldGoalsMade: playerStats.fieldGoalsMade,
				fieldGoalsAttempted: playerStats.fieldGoalsAttempted,
				threePointersMade: playerStats.threePointersMade,
				threePointersAttempted: playerStats.threePointersAttempted,
				freeThrowsMade: playerStats.freeThrowsMade,
				freeThrowsAttempted: playerStats.freeThrowsAttempted,
				rebounds: playerStats.rebounds,
				offensiveRebounds: playerStats.offensiveRebounds,
				defensiveRebounds: playerStats.defensiveRebounds,
				assists: playerStats.assists,
				steals: playerStats.steals,
				blocks: playerStats.blocks,
				turnovers: playerStats.turnovers,
				fouls: playerStats.fouls,
				foulsOn: playerStats.foulsOn,
				blocksReceived: playerStats.blocksReceived,
				plusMinus: playerStats.plusMinus,
				efficiency: playerStats.efficiency
			});
		}
	}, [playerStats, methods]);

	React.useEffect(() => {
		if (isSuccess) {
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
	}, [isSuccess, methods, defaultValues]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default PlayerStatsFormProvider;
