import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import AggregatePlayerStatsForm from '@/components/forms/player-stats/AggregatePlayerStatsForm';
import FormPageLayout from '@/layouts/FormPageLayout';
import { useAggregatePlayerStatById } from '@/hooks/queries/player-stats/UseAggregatePlayerStatById';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { createAggregatePlayerStats } from '@/services/player-stats/CreateAggregatePlayerStats';
import { updateAggregatePlayerStats } from '@/services/player-stats/UpdateAggregatePlayerStats';

const toStr = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const AggregatePlayerStatsFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: stat } = useAggregatePlayerStatById(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: PlayerStatsFormData) =>
			documentId
				? updateAggregatePlayerStats({ ...data, id: documentId })
				: createAggregatePlayerStats(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['player-stats', 'admin-list'] });
			toast.success(
				mode === 'create' ? 'Aggregate line created successfully' : 'Aggregate line updated successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	// Edit mode: wait for the line to load, then render the form with its values so
	// react-hook-form picks them up as defaults on mount.
	if (mode === 'edit' && !stat) {
		return <FormPageLayout>{null}</FormPageLayout>;
	}

	const defaultValues: PlayerStatsFormData | undefined = stat
		? {
				season: toStr(stat.season),
				league: toStr(stat.competition?.id),
				gameId: '',
				teamId: toStr(stat.team?.id),
				playerId: toStr(stat.player?.id),
				status: 'no-data',
				isCaptain: false,
				playerNumber: '',
				gamesPlayed: toStr(stat.gamesPlayed),
				minutes: '',
				seconds: '',
				points: toStr(stat.points),
				fieldGoalsMade: toStr(stat.fieldGoalsMade),
				fieldGoalsAttempted: toStr(stat.fieldGoalsAttempted),
				threePointersMade: toStr(stat.threePointersMade),
				threePointersAttempted: toStr(stat.threePointersAttempted),
				freeThrowsMade: toStr(stat.freeThrowsMade),
				freeThrowsAttempted: toStr(stat.freeThrowsAttempted),
				rebounds: toStr(stat.rebounds),
				offensiveRebounds: toStr(stat.offensiveRebounds),
				defensiveRebounds: toStr(stat.defensiveRebounds),
				assists: toStr(stat.assists),
				steals: toStr(stat.steals),
				blocks: toStr(stat.blocks),
				turnovers: toStr(stat.turnovers),
				fouls: toStr(stat.fouls),
				foulsOn: toStr(stat.foulsOn),
				blocksReceived: toStr(stat.blocksReceived),
				plusMinus: toStr(stat.plusMinus),
				efficiency: toStr(stat.efficiency)
			}
		: undefined;

	return (
		<FormPageLayout>
			<AggregatePlayerStatsForm
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default AggregatePlayerStatsFormPage;
