import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/dasboard-list/dashboard-list';
import GameForm from '@/components/forms/game/GameForm';
import { APP_ROUTES } from '@/constants/routes';
import { useGames } from '@/hooks/queries/game/useGames';
import { useTeams } from '@/hooks/queries/team/useTeams';
import FormPageLayout from '@/layouts/FormPageLayout';
import { GameFormData } from '@/schemas/game-schema';
import { createGame } from '@/services/games/createGame';
import { GameDetailsResponse } from '@/types/api/game';
import { TeamDetailsResponse } from '@/types/api/team';
import { refreshSchedule } from '@/utils/refreshSchedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreateGame: React.FC = () => {
	const queryClient = useQueryClient();

	const { data: games, isLoading, isError, error } = useGames('createdAt', 'desc');
	const { data: teams } = useTeams('slug', 'asc');

	const mutation = useMutation({
		mutationFn: createGame,
		onSuccess: async (_, variables) => {
			const homeTeamName = teams?.find((team: TeamDetailsResponse) => team.id === +variables.home_team);
			const awayTeamName = teams?.find((team: TeamDetailsResponse) => team.id === +variables.away_team);

			// TODO: refresh `schedule` list
			// api/refresh/schedule

			await refreshSchedule();

			toast.success(`Game ${homeTeamName?.name} vs ${awayTeamName?.name} created successfully`);
			queryClient.invalidateQueries({ queryKey: ['games'] });
		},
		onError: (error: Error, variables) => {
			const homeTeamName = teams?.find((team: TeamDetailsResponse) => team.id === +variables.home_team);
			const awayTeamName = teams?.find((team: TeamDetailsResponse) => team.id === +variables.away_team);
			toast.error(`Error creating game ${homeTeamName?.name} vs ${awayTeamName?.name}: ${error.message}`);
			console.error('Error creating game', error.message);
		}
	});

	const handleSubmit = (data: GameFormData) => {
		mutation.mutate(data);
	};

	const itemsArr = games?.map((game: GameDetailsResponse) => {
		if (!game.home_team || !game.away_team) return null;
		return {
			id: game.id,
			item: (
				<Link to={APP_ROUTES.game(game.documentId)}>
					{game.home_team.name} vs {game.away_team.name}
				</Link>
			),
			createdAt: game.createdAt
		};
	});

	return (
		<FormPageLayout>
			<GameForm onSubmit={handleSubmit} mode="create" isSuccess={mutation.isSuccess} />
			<DashboardList
				errorMessage={error?.message || ''}
				isError={isError}
				isLoading={isLoading}
				items={itemsArr || []}
				header="Latest Games"
				title="Games"
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreateGame;
