import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import PlayerForm from '@/components/forms/player/PlayerForm';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';
import FormPageLayout from '@/layouts/FormPageLayout';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { createPlayer } from '@/services/players/CreatePlayer';
import { updatePlayer } from '@/services/players/UpdatePlayer';

const PlayerFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: player } = usePlayerDetails(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: PlayerFormData) =>
			documentId ? updatePlayer({ ...data, id: documentId }) : createPlayer(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['player', 'admin-list'] });
			toast.success(
				mode === 'create'
					? `Player ${variables.first_name} ${variables.last_name} created successfully`
					: 'Player updated successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues = player
		? {
				first_name: player.first_name,
				last_name: player.last_name,
				date_of_birth: player.date_of_birth || undefined,
				date_of_death: player.date_of_death || undefined,
				active_player: player.is_active_player,
				image: player.image ? player.image.id : null,
				nationality: player.nationality,
				primary_position: player.primary_position,
				secondary_position: player.secondary_position
			}
		: undefined;

	return (
		<FormPageLayout>
			<PlayerForm
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				player={player}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default PlayerFormPage;
