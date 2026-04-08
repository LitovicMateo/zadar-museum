import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import PlayerForm from '@/components/forms/player/PlayerForm';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';
import { usePlayers } from '@/hooks/queries/player/UsePlayers';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { updatePlayer } from '@/services/players/UpdatePlayer';
import { useMutation } from '@tanstack/react-query';

import styles from '@/components/Dashboard/shared/EditPage.module.css';

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
			<div className={styles.selectWrap}>
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
						date_of_birth: player.date_of_birth || undefined,
						date_of_death: player.date_of_death || undefined,
						active_player: player.is_active_player,
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
