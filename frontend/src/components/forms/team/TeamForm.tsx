import React from 'react';

import FormWrapper from '@/components/ui/form-wrapper';
import { TeamFormData } from '@/schemas/team-schema';
import { TeamDetailsResponse } from '@/types/api/team';

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
