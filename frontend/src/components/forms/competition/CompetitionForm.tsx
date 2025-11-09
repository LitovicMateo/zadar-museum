import React from 'react';

import FormWrapper from '@/components/ui/form-wrapper';
import { CompetitionFormData } from '@/schemas/competition-schema';
import { CompetitionDetailsResponse } from '@/types/api/competition';

import CompetitionFormContent from './Form/CompetitionFormContent';
import CompetitionFormProvider from './Form/CompetitionFormProvider';

type CompetitionFormProps = {
	onSubmit: (data: CompetitionFormData) => void;
	defaultValues?: CompetitionFormData;
	mode: 'create' | 'edit';
	competition?: CompetitionDetailsResponse;
	isSuccess?: boolean;
};

const emptyDefaults: CompetitionFormData = {
	name: '',
	short_name: '',
	alternate_names: [],
	trophies: []
};

const CompetitionForm: React.FC<CompetitionFormProps> = ({
	onSubmit,
	defaultValues = emptyDefaults,
	mode,
	competition,
	isSuccess
}) => {
	return (
		<FormWrapper>
			<CompetitionFormProvider
				onSubmit={onSubmit}
				defaultValues={defaultValues}
				competition={competition}
				isSuccess={isSuccess}
			>
				<CompetitionFormContent mode={mode} />
			</CompetitionFormProvider>
		</FormWrapper>
	);
};

export default CompetitionForm;
