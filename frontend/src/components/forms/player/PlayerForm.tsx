import React from 'react';

import FormWrapper from '@/components/ui/form-wrapper';
import { PlayerFormData } from '@/schemas/player-schema';
import { PlayerResponse } from '@/types/api/player';

import PlayerFormContent from './Form/PlayerFormContent';
import PlayerFormProvider from './Form/PlayerFormProvider';

type PlayerFormProps = {
	onSubmit: (data: PlayerFormData) => void;
	defaultValues?: PlayerFormData;
	mode: 'create' | 'edit';
	player?: PlayerResponse;
	isSuccess?: boolean;
};

const emptydefaults: PlayerFormData = {
	first_name: '',
	last_name: '',
	date_of_birth: '',
	date_of_death: '',
	active_player: true,
	primary_position: '',
	secondary_position: '',
	image: null,
	nationality: ''
};

const PlayerForm: React.FC<PlayerFormProps> = ({
	mode,
	onSubmit,
	defaultValues = emptydefaults,
	player,
	isSuccess
}) => {
	return (
		<FormWrapper>
			<PlayerFormProvider onSubmit={onSubmit} defaultValues={defaultValues} player={player} isSuccess={isSuccess}>
				<PlayerFormContent mode={mode} />
			</PlayerFormProvider>
		</FormWrapper>
	);
};

export default PlayerForm;
