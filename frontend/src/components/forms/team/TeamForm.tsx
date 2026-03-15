import React from 'react';

import FormWrapper from '@/components/ui/FormWrapper';
import { TeamFormData } from '@/schemas/TeamSchema';
import { TeamDetailsResponse } from '@/types/api/Team';

import TeamFormContent from './Form/TeamFormContent';
import TeamFormProvider from './Form/TeamFormProvider';

type TeamFormOptions = {
	onSubmit: (data: TeamFormData) => void;
	defaultValues?: TeamFormData;
	mode: 'create' | 'edit';
	team?: TeamDetailsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: TeamFormData = {
	name: '',
	short_name: '',
	city: '',
	image: null,
	country: '',
	alternate_names: []
};

const TeamForm: React.FC<TeamFormOptions> = ({ onSubmit, defaultValues = emptyDefaults, mode, team, isSuccess }) => {
	return (
		<FormWrapper>
			<TeamFormProvider onSubmit={onSubmit} defaultValues={defaultValues} team={team} isSuccess={isSuccess}>
				<TeamFormContent mode={mode} />
			</TeamFormProvider>
		</FormWrapper>
	);
};

export default TeamForm;
