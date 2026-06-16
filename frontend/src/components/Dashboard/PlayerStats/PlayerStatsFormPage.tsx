import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import PlayerStatsForm from '@/components/forms/player-stats/PlayerStatsForm';
import FormPageLayout from '@/layouts/FormPageLayout';
import { usePlayerStatById } from '@/hooks/queries/player-stats/UsePlayerStatById';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { createPlayerStats } from '@/services/player-stats/CreatePlayerStats';
import { updatePlayerStats } from '@/services/player-stats/UpdatePlayerStats';

const toStr = (v: unknown) => (v === null || v === undefined ? '' : String(v));

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
			toast.success(
				mode === 'create' ? 'Player stat created successfully' : 'Player stat updated successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues: PlayerStatsFormData | undefined = playerStat
		? (() => {
				const isDnp = playerStat.status === 'dnp-cd';
				const hasOffAndDef =
					playerStat.offensiveRebounds !== null &&
					playerStat.offensiveRebounds !== undefined &&
					playerStat.defensiveRebounds !== null &&
					playerStat.defensiveRebounds !== undefined;

				return {
					season: playerStat.game?.season ?? '',
					league: playerStat.game?.competition?.documentId ?? '',
					gameId: playerStat.game?.id?.toString() ?? '',
					teamId: playerStat.team?.id?.toString() ?? '',
					playerId: playerStat.player?.id?.toString() ?? '',
					status: playerStat.status,
					isCaptain: playerStat.isCaptain,
					playerNumber: isDnp ? '' : toStr(playerStat.playerNumber),
					minutes: isDnp ? '' : toStr(playerStat.minutes),
					seconds: isDnp ? '' : toStr(playerStat.seconds),
					points: isDnp ? '' : toStr(playerStat.points),
					fieldGoalsMade: isDnp ? '' : toStr(playerStat.fieldGoalsMade),
					fieldGoalsAttempted: isDnp ? '' : toStr(playerStat.fieldGoalsAttempted),
					threePointersMade: isDnp ? '' : toStr(playerStat.threePointersMade),
					threePointersAttempted: isDnp ? '' : toStr(playerStat.threePointersAttempted),
					freeThrowsMade: isDnp ? '' : toStr(playerStat.freeThrowsMade),
					freeThrowsAttempted: isDnp ? '' : toStr(playerStat.freeThrowsAttempted),
					rebounds: isDnp ? '' : hasOffAndDef ? '' : toStr(playerStat.rebounds),
					offensiveRebounds: isDnp ? '' : toStr(playerStat.offensiveRebounds),
					defensiveRebounds: isDnp ? '' : toStr(playerStat.defensiveRebounds),
					assists: isDnp ? '' : toStr(playerStat.assists),
					steals: isDnp ? '' : toStr(playerStat.steals),
					blocks: isDnp ? '' : toStr(playerStat.blocks),
					turnovers: isDnp ? '' : toStr(playerStat.turnovers),
					fouls: isDnp ? '' : toStr(playerStat.fouls),
					foulsOn: isDnp ? '' : toStr(playerStat.foulsOn),
					blocksReceived: isDnp ? '' : toStr(playerStat.blocksReceived),
					plusMinus: isDnp ? '' : toStr(playerStat.plusMinus),
					efficiency: isDnp ? '' : toStr(playerStat.efficiency)
				};
			})()
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
