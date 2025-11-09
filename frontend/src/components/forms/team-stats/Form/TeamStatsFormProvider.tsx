import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { TeamStatsFormData, teamStatsSchema } from '@/schemas/team-stats-schema';
import { TeamStatsResponse } from '@/types/api/team-stats';
import { zodResolver } from '@hookform/resolvers/zod';

type TeamStatsFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: TeamStatsFormData) => void;
	defaultValues: TeamStatsFormData;
	teamStats?: TeamStatsResponse;
	isSuccess?: boolean;
};

const TeamStatsFormProvider: React.FC<TeamStatsFormProviderProps> = ({
	children,
	onSubmit,
	defaultValues,
	teamStats,
	isSuccess
}) => {
	const methods = useForm<TeamStatsFormData>({
		resolver: zodResolver(teamStatsSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<TeamStatsFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	React.useEffect(() => {
		if (teamStats) {
			methods.reset({
				league: teamStats.game.competition.id.toString(),
				season: teamStats.game.season,
				gameId: teamStats.game.id.toString(),
				teamId: teamStats.team.id.toString(),
				coachId: teamStats.coach.id.toString(),
				assistantCoachId: teamStats.assistantCoach ? teamStats.assistantCoach.id.toString() : '',
				firstQuarter: teamStats.firstQuarter,
				secondQuarter: teamStats.secondQuarter,
				thirdQuarter: teamStats.thirdQuarter,
				fourthQuarter: teamStats.fourthQuarter,
				overtime: teamStats.overtime,
				fieldGoalsMade: teamStats.fieldGoalsMade,
				fieldGoalsAttempted: teamStats.fieldGoalsAttempted,
				threePointersMade: teamStats.threePointersMade,
				threePointersAttempted: teamStats.threePointersAttempted,
				freeThrowsMade: teamStats.freeThrowsMade,
				freeThrowsAttempted: teamStats.freeThrowsAttempted,
				rebounds: teamStats.rebounds,
				offensiveRebounds: teamStats.offensiveRebounds,
				defensiveRebounds: teamStats.defensiveRebounds,
				assists: teamStats.assists,
				steals: teamStats.steals,
				blocks: teamStats.blocks,
				turnovers: teamStats.turnovers,
				fouls: teamStats.fouls,
				secondChancePoints: teamStats.secondChancePoints,
				fastBreakPoints: teamStats.fastBreakPoints,
				pointsOffTurnovers: teamStats.pointsOffTurnovers,
				benchPoints: teamStats.benchPoints,
				pointsInPaint: teamStats.pointsInPaint
			});
		}
	}, [teamStats, methods]);

	React.useEffect(() => {
		if (isSuccess) {
			const currentValues = methods.getValues();
			methods.reset({
				...defaultValues,
				season: currentValues.season,
				league: currentValues.league,
				gameId: currentValues.gameId
			});
		}
	}, [isSuccess, methods, defaultValues]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default TeamStatsFormProvider;
