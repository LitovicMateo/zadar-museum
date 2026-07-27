import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import GameForm from '@/components/forms/game/GameForm';
import FormPageLayout from '@/layouts/FormPageLayout';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { GameFormData } from '@/schemas/GameSchema';
import { createGame } from '@/services/games/CreateGame';
import { updateGame } from '@/services/games/UpdateGame';
import { refreshSchedule } from '@/utils/RefreshSchedule';

const GameFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: game } = useGameDetails(documentId ?? '');

	const mutation = useMutation({
		mutationFn: async (data: GameFormData) => {
			if (documentId) {
				return updateGame({ ...data, id: documentId });
			}
			return createGame(data);
		},
		onSuccess: async () => {
			await refreshSchedule();
			queryClient.invalidateQueries({ queryKey: ['game', 'admin-list'] });
			toast.success(mode === 'create' ? 'Game created successfully' : 'Game updated successfully');
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues: GameFormData | undefined = game
		? {
				season: game.season,
				round: game.round,
				group_name: game.group_name || '',
				date: game.date,
				home_team: game.home_team.id.toString(),
				home_team_name: game.home_team_name,
				home_team_short_name: game.home_team_short_name || game.home_team.short_name,
				away_team: game.away_team.id.toString(),
				away_team_name: game.away_team_name,
				away_team_short_name: game.away_team_short_name || game.away_team.short_name,
				stage: game.stage,
				period_format: game.period_format ?? 'quarters',
				competition: game.competition.id.toString(),
				league_name: game.competition.name,
				league_short_name: game.competition.short_name,
				venue: game.venue.id.toString(),
				isNeutral: game.isNeutral,
				isNulled: game.isNulled,
				forfeited: game.forfeited,
				forfeited_by: game.forfeited_by,
				attendance: game.attendance,
				mainReferee: game.mainReferee ? game.mainReferee.id.toString() : undefined,
				secondReferee: game.secondReferee ? game.secondReferee.id.toString() : undefined,
				thirdReferee: game.thirdReferee ? game.thirdReferee.id.toString() : undefined,
				staffers: game.staffers?.map((st) => st.id.toString()),
				gallery: game.gallery
			}
		: undefined;

	return (
		<FormPageLayout>
			<GameForm
				game={game}
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default GameFormPage;
