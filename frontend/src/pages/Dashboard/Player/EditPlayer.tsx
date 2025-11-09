import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import PlayerForm from '@/components/forms/player/PlayerForm';
import { usePlayerDetails } from '@/hooks/queries/player/usePlayerDetails';
import { usePlayers } from '@/hooks/queries/player/usePlayers';
import { PlayerFormData } from '@/schemas/player-schema';
import { updatePlayer } from '@/services/players/updatePlayer';
import { useMutation } from '@tanstack/react-query';

const EditPlayer = () => {
	const [playerId, setPlayerId] = React.useState('');

	const { data: players } = usePlayers('last_name', 'asc');
	const { data: player } = usePlayerDetails(playerId!);

	const mutation = useMutation({
		mutationFn: updatePlayer,
		onError(error) {
			toast.error(`Error updating player: ${error.message}`);
		},
		onSuccess() {
			toast.success('Player updated successfully');
		}
	});

	const handleSubmit = (data: PlayerFormData) => {
		mutation.mutate({ ...data, id: playerId });
	};

	return (
		<div>
			<div className="max-w-[200px] w-full py-4">
				<Select
					options={players?.map((player) => ({
						label: `${player.first_name} ${player.last_name}`,
						value: player.documentId
					}))}
					onChange={(e) => setPlayerId(e!.value)}
					isSearchable
				/>
			</div>
			{player && (
				<PlayerForm
					player={player}
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						first_name: player.first_name,
						last_name: player.last_name,
						date_of_birth: player.date_of_birth || null,
						date_of_death: player.date_of_death || null,
						active_player: player.isActivePlayer,
						image: player.image ? player.image.id : null,
						nationality: player.nationality,
						primary_position: player.primary_position,
						secondary_position: player.secondary_position
					}}
				/>
			)}
			<Toaster position="bottom-center" />
		</div>
	);
};

export default EditPlayer;
