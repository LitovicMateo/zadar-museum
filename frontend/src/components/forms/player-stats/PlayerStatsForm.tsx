import React from 'react';

import FormWrapper from '@/components/ui/FormWrapper';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { PlayerStatsResponse } from '@/types/api/PlayerStats';

import PlayerStatsFormContent from './Form/PlayerStatsFormContent';
import PlayerStatsFormProvider from './Form/PlayerStatsFormProvider';

type GameFormProps = {
	onSubmit: (data: PlayerStatsFormData) => void;
	defaultValues?: PlayerStatsFormData;
	mode: 'create' | 'edit';
	playerStats?: PlayerStatsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: PlayerStatsFormData = {
	season: '',
	league: '',
	gameId: '',
	teamId: '',
	playerId: '',
	status: 'starter',
	isCaptain: false,
	playerNumber: '',
	minutes: '',
	seconds: '',
	points: '',
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
	turnovers: '',
	fouls: '',
	foulsOn: '',
	blocksReceived: '',
	plusMinus: '',
	efficiency: ''
};

const PlayerStatsForm: React.FC<GameFormProps> = ({
	onSubmit,
	defaultValues = emptyDefaults,
	mode,
	playerStats,
	isSuccess
}) => {
	return (
		<FormWrapper>
			<PlayerStatsFormProvider
				onSubmit={onSubmit}
				defaultValues={defaultValues}
				playerStats={playerStats}
				isSuccess={isSuccess}
			>
				<PlayerStatsFormContent mode={mode} />
			</PlayerStatsFormProvider>
		</FormWrapper>
	);
};

export default PlayerStatsForm;
