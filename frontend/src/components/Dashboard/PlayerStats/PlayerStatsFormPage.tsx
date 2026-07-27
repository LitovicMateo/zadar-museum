import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import PlayerStatsForm from '@/components/forms/player-stats/PlayerStatsForm';
import { buildPlayerStatsDefaults } from '@/components/forms/player-stats/Form/buildPlayerStatsDefaults';
import FormPageLayout from '@/layouts/FormPageLayout';
import { usePlayerStatById } from '@/hooks/queries/player-stats/UsePlayerStatById';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { createPlayerStats } from '@/services/player-stats/CreatePlayerStats';
import { updatePlayerStats } from '@/services/player-stats/UpdatePlayerStats';

const PlayerStatsFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: playerStat } = usePlayerStatById(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: PlayerStatsFormData) =>
			documentId ? updatePlayerStats({ ...data, id: documentId }) : createPlayerStats(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['player-stats', 'admin-list'] });
			if (documentId) {
				queryClient.invalidateQueries({ queryKey: ['player-stat', documentId] });
			}
			toast.success(
				mode === 'create' ? 'Player stat created successfully' : 'Player stat updated successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues: PlayerStatsFormData | undefined = playerStat
		? buildPlayerStatsDefaults(playerStat)
		: undefined;

	return (
		<FormPageLayout>
			<PlayerStatsForm
				playerStats={playerStat}
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default PlayerStatsFormPage;
