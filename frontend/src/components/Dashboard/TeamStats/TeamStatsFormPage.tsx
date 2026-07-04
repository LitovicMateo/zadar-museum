import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import TeamStatsForm from '@/components/forms/team-stats/TeamStatsForm';
import { buildTeamStatsDefaults } from '@/components/forms/team-stats/Form/buildTeamStatsDefaults';
import FormPageLayout from '@/layouts/FormPageLayout';
import { useTeamStatById } from '@/hooks/queries/team-stats/UseTeamStatById';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { createTeamStats } from '@/services/team-stats/CreateTeamStats';
import { updateTeamStats } from '@/services/team-stats/UpdateTeamStats';

const TeamStatsFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: teamStat } = useTeamStatById(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: TeamStatsFormData) =>
			documentId ? updateTeamStats({ ...data, id: documentId }) : createTeamStats(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['team-stats', 'admin-list'] });
			toast.success(
				mode === 'create' ? 'Team stat created successfully' : 'Team stat updated successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	const defaultValues: TeamStatsFormData | undefined = teamStat
		? buildTeamStatsDefaults(teamStat)
		: undefined;

	return (
		<FormPageLayout>
			<TeamStatsForm
				teamStats={teamStat}
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default TeamStatsFormPage;
