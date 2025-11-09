import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import DashboardList from '@/components/dasboard-list/dashboard-list';
import TeamStatsForm from '@/components/forms/team-stats/TeamStatsForm';
import { APP_ROUTES } from '@/constants/routes';
import { useTeamStats } from '@/hooks/queries/team-stats/useTeamStats';
import FormPageLayout from '@/layouts/FormPageLayout';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';
import { createTeamStats } from '@/services/team-stats/createTeamStats';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreateTeamStats: React.FC = () => {
	const queryClient = useQueryClient();

	const { data: recentItems } = useTeamStats('createdAt', 'desc');

	const mutation = useMutation({
		mutationFn: createTeamStats,
		onSuccess: () => {
			toast.success('Team Stats created successfully');
			queryClient.invalidateQueries({ queryKey: ['recent', 'team-stats'] });
		},
		onError: (err: Error) => toast.error(err.message)
	});

	const handleSubmit = (data: TeamStatsFormData) => {
		mutation.mutate(data);
	};

	const items = recentItems?.map((item) => {
		const name = `${item.coach?.first_name ?? ''} ${item.coach?.last_name ?? ''} (${item.team?.short_name ?? ''})`;
		const game = `${item.game?.home_team?.short_name ?? 'Unknown'} vs ${item.game?.away_team?.short_name ?? 'Unknown'}`;

		return {
			id: item.id,
			item: (
				<Link to={APP_ROUTES.game(item.game?.documentId)}>
					{name} - {game}
				</Link>
			),
			createdAt: item.createdAt
		};
	});

	return (
		<FormPageLayout>
			<TeamStatsForm onSubmit={handleSubmit} mode="create" isSuccess={mutation.isSuccess} />
			<DashboardList
				errorMessage=""
				isError={false}
				isLoading={false}
				items={items ?? []}
				header="Latest Team Stats"
				title="Team Stats"
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default CreateTeamStats;
