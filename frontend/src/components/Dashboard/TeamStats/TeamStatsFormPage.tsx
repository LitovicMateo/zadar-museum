import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import TeamStatsForm from '@/components/forms/team-stats/TeamStatsForm';
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
		? {
				season: teamStat.game?.season ?? '',
				league: teamStat.game?.competition?.documentId ?? '',
				gameId: teamStat.game?.id?.toString() ?? '',
				teamId: teamStat.team?.id?.toString() ?? '',
				coachId: teamStat.coach?.id?.toString() ?? '',
				assistantCoachId: teamStat.assistantCoach?.id?.toString() ?? '',
				firstQuarter: teamStat.firstQuarter?.toString() ?? '',
				secondQuarter: teamStat.secondQuarter?.toString() ?? '',
				thirdQuarter: teamStat.thirdQuarter?.toString() ?? '',
				fourthQuarter: teamStat.fourthQuarter?.toString() ?? '',
				overtime: teamStat.overtime ? teamStat.overtime.toString() : null,
				fieldGoalsMade: teamStat.fieldGoalsMade?.toString() ?? '',
				fieldGoalsAttempted: teamStat.fieldGoalsAttempted?.toString() ?? '',
				threePointersMade: teamStat.threePointersMade?.toString() ?? '',
				threePointersAttempted: teamStat.threePointersAttempted?.toString() ?? '',
				freeThrowsMade: teamStat.freeThrowsMade?.toString() ?? '',
				freeThrowsAttempted: teamStat.freeThrowsAttempted?.toString() ?? '',
				rebounds: teamStat.rebounds?.toString() ?? '',
				offensiveRebounds: teamStat.offensiveRebounds?.toString() ?? '',
				defensiveRebounds: teamStat.defensiveRebounds?.toString() ?? '',
				assists: teamStat.assists?.toString() ?? '',
				turnovers: teamStat.turnovers?.toString() ?? '',
				steals: teamStat.steals?.toString() ?? '',
				blocks: teamStat.blocks?.toString() ?? '',
				fouls: teamStat.fouls?.toString() ?? '',
				secondChancePoints: teamStat.secondChancePoints?.toString() ?? '',
				fastBreakPoints: teamStat.fastBreakPoints?.toString() ?? '',
				pointsOffTurnovers: teamStat.pointsOffTurnovers?.toString() ?? '',
				benchPoints: teamStat.benchPoints?.toString() ?? '',
				pointsInPaint: teamStat.pointsInPaint?.toString() ?? ''
			}
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
