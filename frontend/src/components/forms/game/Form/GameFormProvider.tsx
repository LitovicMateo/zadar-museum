import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { GameFormData, gameSchema } from '@/schemas/game-schema';
import { GameDetailsResponse } from '@/types/api/game';
import { zodResolver } from '@hookform/resolvers/zod';

type GameFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: GameFormData) => void;
	defaultValues: GameFormData;
	game?: GameDetailsResponse;
	isSuccess?: boolean;
};

const GameFormProvider: React.FC<GameFormProviderProps> = ({ children, onSubmit, defaultValues, game, isSuccess }) => {
	const methods = useForm<GameFormData>({
		resolver: zodResolver(gameSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<GameFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (game) {
			methods.reset({
				season: game.season,
				round: game.round,
				date: game.date,
				home_team: game.home_team.id.toString(),
				home_team_name: game.home_team.name,
				home_team_short_name: game.home_team.short_name,
				away_team: game.away_team.id.toString(),
				away_team_name: game.away_team.name,
				away_team_short_name: game.away_team.short_name,
				stage: game.stage,
				competition: game.competition.id.toString(),
				league_name: game.competition.name,
				league_short_name: game.competition.short_name,
				venue: game.venue.id.toString(),
				isNeutral: game.isNeutral,
				isNulled: game.isNulled,
				forfeited: game.forfeited,
				forfeited_by: game.forfeited_by,
				attendance: game.attendance ? game.attendance : undefined,
				mainReferee: game.mainReferee ? game.mainReferee.id.toString() : undefined,
				secondReferee: game.secondReferee ? game.secondReferee.id.toString() : undefined,
				thirdReferee: game.thirdReferee ? game.thirdReferee.id.toString() : undefined,
				// map backend staff objects to form values (string ids)
				staffers: game.staffers ? game.staffers.map((s) => s.id.toString()) : undefined
			});
		}
	}, [game, methods]);

	React.useEffect(() => {
		if (isSuccess) {
			const currentValues = methods.getValues();

			methods.reset({
				...defaultValues,
				season: currentValues.season,
				competition: currentValues.competition,
				league_name: currentValues.league_name,
				league_short_name: currentValues.league_short_name
			});

			methods.setFocus('date');
		}
	}, [isSuccess, defaultValues, methods]);
	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default GameFormProvider;
