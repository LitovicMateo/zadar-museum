import React from 'react';

import FormWrapper from '@/components/ui/form-wrapper';
import { GameFormData } from '@/schemas/game-schema';
import { GameDetailsResponse } from '@/types/api/game';

import GameFormContent from './Form/GameFormContent';
import GameFormProvider from './Form/GameFormProvider';

type GameFormProps = {
	onSubmit: (data: GameFormData) => void;
	defaultValues?: GameFormData;
	mode: 'create' | 'edit';
	game?: GameDetailsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: GameFormData = {
	season: '',
	round: '',
	date: '',
	home_team: '',
	home_team_name: '',
	home_team_short_name: '',
	away_team: '',
	away_team_name: '',
	away_team_short_name: '',
	stage: null,
	competition: '',
	league_name: '',
	league_short_name: '',
	venue: '',
	isNeutral: false,
	isNulled: false,
	forfeited: false,
	forfeited_by: 'none',
	attendance: undefined,
	mainReferee: undefined,
	secondReferee: undefined,
	thirdReferee: undefined,
	gallery: null
};

const GameForm: React.FC<GameFormProps> = ({ onSubmit, defaultValues = emptyDefaults, mode, game, isSuccess }) => {
	return (
		<FormWrapper>
			<GameFormProvider onSubmit={onSubmit} defaultValues={defaultValues} game={game} isSuccess={isSuccess}>
				<GameFormContent mode={mode} />
			</GameFormProvider>
		</FormWrapper>
	);
};

export default GameForm;
