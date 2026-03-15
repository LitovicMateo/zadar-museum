import React from 'react';

import FormWrapper from '@/components/ui/FormWrapper';
import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { TeamStatsResponse } from '@/types/api/TeamStats';

import TeamStatsFormContent from './Form/TeamStatsFormContent';
import TeamStatsFormProvider from './Form/TeamStatsFormProvider';

type GameFormProps = {
	onSubmit: (data: TeamStatsFormData) => void;
	defaultValues?: TeamStatsFormData;
	mode: 'create' | 'edit';
	teamStats?: TeamStatsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: TeamStatsFormData = {
	league: '',
	season: '',
	gameId: '',
	teamId: '',
	coachId: '',
	assistantCoachId: '',
	firstQuarter: '',
	secondQuarter: '',
	thirdQuarter: '',
	fourthQuarter: '',
	overtime: '',
	fieldGoalsMade: '',
	fieldGoalsAttempted: '',
	threePointersMade: '',
	threePointersAttempted: '',
	freeThrowsMade: '',
	freeThrowsAttempted: '',
	rebounds: '',
	offensiveRebounds: '',
	defensiveRebounds: '',
	assists: '',
	steals: '',
	blocks: '',
	fouls: '',
	turnovers: '',
	secondChancePoints: '',
	fastBreakPoints: '',
	pointsOffTurnovers: '',
	benchPoints: '',
	pointsInPaint: ''
};

const TeamStatsForm: React.FC<GameFormProps> = ({
	onSubmit,
	defaultValues = emptyDefaults,
	mode,
	teamStats,
	isSuccess
}) => {
	return (
		<FormWrapper>
			<TeamStatsFormProvider
				onSubmit={onSubmit}
				defaultValues={defaultValues}
				teamStats={teamStats}
				isSuccess={isSuccess}
			>
				<TeamStatsFormContent mode={mode} />
			</TeamStatsFormProvider>
		</FormWrapper>
	);
};

export default TeamStatsForm;
