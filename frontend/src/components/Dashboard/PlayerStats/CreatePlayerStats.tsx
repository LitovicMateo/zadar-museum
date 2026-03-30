import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/DashboardList/DashboardList';
import PlayerStatsForm from '@/components/forms/player-stats/PlayerStatsForm';
import { APP_ROUTES } from '@/constants/Routes';
import { usePlayerStats } from '@/hooks/queries/player-stats/UsePlayerStats';
import FormPageLayout from '@/layouts/FormPageLayout';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { createPlayerStats } from '@/services/player-stats/CreatePlayerStats';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreatePlayerStats: React.FC = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: createPlayerStats,
		onSuccess: () => {
			toast.success('Player Stats created successfully');
			queryClient.invalidateQueries({ queryKey: ['player-stats', 'recent'] });
		},
		onError: (err: Error) => toast.error(err.message)
	});

	const handleSubmit = (data: PlayerStatsFormData) => {
		mutation.mutate(data);
	};

	const { data: recentItems } = usePlayerStats('createdAt', 'desc');

	const items = recentItems?.map((item) => {
		const name = `${item.player?.first_name ?? ''} ${item.player?.last_name ?? ''} (${item.team?.short_name ?? ''})`;
		const game = `${item.game?.home_team?.short_name ?? 'Unknown'} vs ${item.game?.away_team?.short_name ?? 'Unknown'}`;

		return {
			id: item.id,
			item: (
				<Link to={APP_ROUTES.player(item.player?.documentId)}>
					{name} - {game}
				</Link>
			),
			createdAt: item.createdAt
		};
	});

	return (
		<FormPageLayout>
			<PlayerStatsForm onSubmit={handleSubmit} mode="create" isSuccess={mutation.isSuccess} />
			<DashboardList
				errorMessage=""
				isError={false}
				isLoading={false}
				items={items ?? []}
				header="Latest Player Stats"
				title="Player Stats"
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreatePlayerStats;
