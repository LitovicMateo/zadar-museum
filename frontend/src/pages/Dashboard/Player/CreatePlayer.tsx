import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/dasboard-list/dashboard-list';
import PlayerForm from '@/components/forms/player/PlayerForm';
import { APP_ROUTES } from '@/constants/routes';
import { usePlayers } from '@/hooks/queries/player/usePlayers';
import FormPageLayout from '@/layouts/FormPageLayout';
import { PlayerFormData } from '@/schemas/player-schema';
import { createPlayer } from '@/services/players/createPlayer';
import { PlayerResponse } from '@/types/api/player';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreatePlayer: React.FC = () => {
	const queryClient = useQueryClient();

	const { data: players, isLoading, isError, error } = usePlayers('createdAt', 'desc');

	const mutation = useMutation({
		mutationFn: createPlayer,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['players'] });
			toast.success(`Player ${variables.first_name} ${variables.last_name} created successfully`);
		},
		onError: (error: Error, variables) => {
			console.error('Error creating player', error.message);
			toast.error(`Error creating player ${variables.first_name} ${variables.last_name}: ${error.message}`);
		}
	});

	const handleSubmit = (data: PlayerFormData) => {
		mutation.mutate(data);
	};

	const itemsArr = players?.map((player: PlayerResponse) => ({
		id: player.id,
		item: (
			<Link to={APP_ROUTES.player(player.documentId)}>
				{player.first_name} {player.last_name}
			</Link>
		),
		createdAt: player.createdAt
	}));

	return (
		<FormPageLayout>
			<PlayerForm onSubmit={handleSubmit} mode="create" isSuccess={mutation.isSuccess} />
			<DashboardList
				title="Players"
				header="Player"
				items={itemsArr}
				isLoading={isLoading}
				isError={isError}
				errorMessage={error?.message || ''}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreatePlayer;
